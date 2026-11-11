const nodemailer = require('nodemailer');
const { config } = require('./config');

let transporter;
if (config.mail.host) {
  transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: config.mail.user ? { user: config.mail.user, pass: config.mail.password } : undefined
  });
}

async function sendMail({ to, subject, text }) {
  if (!transporter) {
    if (config.nodeEnv === 'production') throw new Error('Email is not configured.');
    console.info(`[mail not configured] ${subject} -> ${to}\n${text}`);
    return;
  }
  await transporter.sendMail({ from: config.mail.from, to, subject, text });
}

module.exports = { sendMail };
