const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { getUsers, saveUsers } = require('../utils/userStore');
const { sendSignupOtpEmail, validateEmailConfig } = require('../utils/mailer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const OTP_TTL_MS = 5 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

const pendingRegistrations = new Map();
const googleAudiences = (process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  picture: user.picture,
  createdAt: user.createdAt,
});

const deriveDisplayName = (email, displayName) => {
  if (displayName && displayName.trim()) {
    return displayName.trim();
  }

  const emailPrefix = (email || '').split('@')[0] || 'Candidate';
  return emailPrefix
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim() || 'Candidate';
};

const buildAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

const signToken = (user) => jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const isOtpExpired = (entry) => !entry || Date.now() > entry.expiresAt;

const register = async (req, res) => {
  try {
    try {
      validateEmailConfig();
    } catch (configError) {
      return res.status(503).json({
        error: 'Signup OTP email service is not configured on server. Configure SMTP or use Google sign-in.',
      });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '').trim();
    const displayName = String(req.body?.displayName || '').trim();

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const users = getUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = Date.now() + OTP_TTL_MS;

    await sendSignupOtpEmail({
      toEmail: email,
      otp,
      displayName,
      ttlMinutes: Math.floor(OTP_TTL_MS / (60 * 1000)),
    });

    pendingRegistrations.set(email, {
      email,
      passwordHash,
      displayName,
      otpHash,
      expiresAt,
    });

    const response = {
      message: 'OTP sent to your email. Please verify to complete signup.',
      expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Register OTP init error:', error);
    return res.status(500).json({ error: 'Failed to send OTP for registration.' });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const otp = String(req.body?.otp || '').trim();

    if (!EMAIL_REGEX.test(email) || !OTP_REGEX.test(otp)) {
      return res.status(400).json({ error: 'Valid email and 6-digit OTP are required.' });
    }

    const pending = pendingRegistrations.get(email);
    if (!pending) {
      return res.status(400).json({ error: 'No pending signup found. Please request a new OTP.' });
    }

    if (isOtpExpired(pending)) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    const otpMatches = await bcrypt.compare(otp, pending.otpHash);
    if (!otpMatches) {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }

    const users = getUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) {
      pendingRegistrations.delete(email);
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const name = deriveDisplayName(email, pending.displayName);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash: pending.passwordHash,
      picture: buildAvatar(name),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    pendingRegistrations.delete(email);

    const token = signToken(newUser);
    return res.status(201).json({ user: sanitizeUser(newUser), token });
  } catch (error) {
    console.error('Verify register OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP and register user.' });
  }
};

const login = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '').trim();

    if (!EMAIL_REGEX.test(email) || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login.' });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required.' });
    }

    if (googleAudiences.length === 0) {
      return res.status(500).json({ error: 'Google auth is not configured on server.' });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: googleAudiences,
      });
    } catch (err) {
      console.error('Google token verification failed:', err);
      return res.status(401).json({
        error: 'Invalid Google token or OAuth client ID mismatch.',
      });
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Google sign-in failed. Email missing.' });
    }

    const { email, name, picture, sub: googleId } = payload;
    const normalizedEmail = email.toLowerCase();
    
    const users = getUsers();
    let user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      const displayName = deriveDisplayName(normalizedEmail, name);
      user = {
        id: `google-${googleId}`,
        name: displayName,
        email: normalizedEmail,
        picture: picture || buildAvatar(displayName),
        googleId,
        createdAt: new Date().toISOString(),
      };
      
      users.push(user);
      saveUsers(users);
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (picture && user.picture.includes('ui-avatars.com')) {
        user.picture = picture; 
      }
      saveUsers(users);
    }

    const token = signToken(user);
    return res.status(200).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: 'Failed to authenticate with Google.' });
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  googleLogin,
};
