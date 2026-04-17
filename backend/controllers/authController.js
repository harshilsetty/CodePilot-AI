const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, saveUsers } = require('../utils/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const register = async (req, res) => {
  try {
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

    const name = deriveDisplayName(email, displayName);
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash,
      picture: buildAvatar(name),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = signToken(newUser);
    return res.status(201).json({ user: sanitizeUser(newUser), token });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to register user.' });
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

module.exports = {
  register,
  login,
};
