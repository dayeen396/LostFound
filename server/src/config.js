require('dotenv').config();
const path = require('node:path');

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtTtl: process.env.JWT_TTL || '2h',
  campusIdPepper: process.env.CAMPUS_ID_PEPPER || process.env.JWT_SECRET || '',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'du_lost_found',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  uploadDir: path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads')),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024,
  itemExpiryDays: Number(process.env.ITEM_EXPIRY_DAYS || 90),
  mail: {
    host: process.env.MAIL_HOST || '',
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    from: process.env.MAIL_FROM || 'DU Lost & Found <no-reply@example.com>'
  }
};

function validateConfig() {
  if (config.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters.');
  }
  if (!/^\d+(s|m|h|d)$/.test(config.jwtTtl)) {
    throw new Error('JWT_TTL must be a positive duration such as 30m or 2h.');
  }
  try {
    new URL(config.appOrigin);
  } catch {
    throw new Error('APP_ORIGIN must be a valid absolute URL.');
  }
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
  }
  if (!Number.isInteger(config.itemExpiryDays) || config.itemExpiryDays < 1) {
    throw new Error('ITEM_EXPIRY_DAYS must be a positive integer.');
  }
  if (config.nodeEnv === 'production' && !config.mail.host) {
    throw new Error('MAIL_HOST must be configured in production so account verification and password resets work.');
  }
}

module.exports = { config, validateConfig };
