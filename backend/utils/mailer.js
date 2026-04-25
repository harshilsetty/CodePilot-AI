const nodemailer = require('nodemailer');

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required email configuration: ${key}`);
  }
  return value;
};

const assertNotPlaceholder = (key, value) => {
  const normalized = String(value || '').toLowerCase();
  const placeholderPatterns = ['your_email@gmail.com', 'your_app_password', 'replace_with', 'your_'];
  const isPlaceholder = placeholderPatterns.some((pattern) => normalized.includes(pattern));

  if (isPlaceholder) {
    throw new Error(`Invalid email configuration for ${key}: placeholder value detected.`);
  }
};

const getMailerConfig = () => ({
  host: getRequiredEnv('SMTP_HOST'),
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
  user: getRequiredEnv('SMTP_USER').trim(),
  // Gmail app passwords are often copied with spaces; SMTP expects a continuous token.
  pass: getRequiredEnv('SMTP_PASS').replace(/\s+/g, ''),
  from: getRequiredEnv('SMTP_FROM').trim(),
});

const validateEmailConfig = () => {
  const cfg = getMailerConfig();
  assertNotPlaceholder('SMTP_USER', cfg.user);
  assertNotPlaceholder('SMTP_PASS', cfg.pass);
  assertNotPlaceholder('SMTP_FROM', cfg.from);
};

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const cfg = getMailerConfig();
  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });

  return transporter;
};

const sendSignupOtpEmail = async ({ toEmail, otp, displayName, ttlMinutes = 5 }) => {
  const cfg = getMailerConfig();
  const greetingName = displayName && displayName.trim() ? displayName.trim() : 'Candidate';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #111827;">
      <h2 style="margin-bottom: 8px;">PrepPilot AI Verification</h2>
      <p style="margin-top: 0;">Hi ${greetingName},</p>
      <p>Your OTP for account signup is:</p>
      <div style="font-size: 32px; letter-spacing: 6px; font-weight: 700; margin: 16px 0; color: #0f766e;">${otp}</div>
      <p>This OTP is valid for ${ttlMinutes} minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  await getTransporter().sendMail({
    from: cfg.from,
    to: toEmail,
    subject: 'Your PrepPilot AI OTP',
    text: `Your PrepPilot AI OTP is ${otp}. It is valid for ${ttlMinutes} minutes.`,
    html,
  });
};

module.exports = {
  sendSignupOtpEmail,
  validateEmailConfig,
};
