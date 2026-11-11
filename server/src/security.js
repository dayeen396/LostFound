const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { config } = require('./config');
const db = require('./db');

function jwtCookieMaxAge() {
  const [, amount, unit] = config.jwtTtl.match(/^(\d+)(s|m|h|d)$/) || [];
  const duration = Number(amount || 7200);
  const milliseconds = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit || 's'];
  return duration * milliseconds;
}

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
};

const validators = {
  register: [
    body('name').isString().trim().isLength({ min: 2, max: 120 }).customSanitizer(v => cleanText(v, 120)),
    body('email').isEmail().normalizeEmail().isLength({ max: 254 }),
    body('password').isString().isLength({ min: 10, max: 128 }),
    body('affiliation').optional().isIn(['student', 'teacher', 'staff', 'hall_resident', 'other']),
    body('departmentOrHall').optional().isString().isLength({ max: 160 }).customSanitizer(v => cleanText(v, 160)),
    body('studentId').optional({ values: 'falsy' }).isString().trim().isLength({ min: 4, max: 32 }).matches(/^[A-Za-z0-9-]+$/)
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 128 })
  ],
  post: [
    body('itemType').isIn(['lost', 'found']),
    body('title').isString().trim().isLength({ min: 3, max: 180 }).customSanitizer(v => cleanText(v, 180)),
    body('categoryId').isInt({ min: 1 }).toInt(),
    body('locationId').isInt({ min: 1 }).toInt(),
    body('description').isString().trim().isLength({ min: 10, max: 5000 }).customSanitizer(v => cleanText(v, 5000)),
    body('privateDetails').optional({ values: 'falsy' }).isString().isLength({ max: 1500 }).customSanitizer(v => cleanText(v, 1500)),
    body('occurredAt').isISO8601().toDate(),
    body('extraLocationText').optional({ values: 'falsy' }).isString().isLength({ max: 240 }).customSanitizer(v => cleanText(v, 240)),
    body('contactPreference').optional().isIn(['internal_message', 'email', 'phone'])
  ],
  claim: [
    body('proofAnswer').isString().trim().isLength({ min: 10, max: 2000 }).customSanitizer(v => cleanText(v, 2000))
  ],
  message: [
    body('body').isString().trim().isLength({ min: 1, max: 3000 }).customSanitizer(v => cleanText(v, 3000))
  ]
};

async function validationErrors(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    await deleteUploadedFiles(req.files);
    return res.status(400).json({ error: 'Validation failed', details: result.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  }
  return next();
}

function signToken(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, config.jwtSecret, { expiresIn: config.jwtTtl });
}

function setAuthCookie(res, user) {
  res.cookie('du_lf_session', signToken(user), {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: jwtCookieMaxAge(),
    path: '/'
  });
}

const clearAuthCookie = res => res.clearCookie('du_lf_session', { httpOnly: true, sameSite: 'strict', path: '/' });

async function authenticate(req, res, next) {
  const token = req.cookies.du_lf_session || (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, role, account_status, affiliation, department_or_hall, du_verified_at, locale FROM users WHERE id = ? AND deleted_at IS NULL',
      [payload.sub]
    );
    if (!rows.length || rows[0].account_status !== 'active') {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'Account is unavailable' });
    }
    req.user = rows[0];
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'Session is invalid or expired' });
    }
    return next(error);
  }
}

async function optionalAuthenticate(req, res, next) {
  const token = req.cookies.du_lf_session || (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return next();
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, role, account_status, affiliation, department_or_hall, du_verified_at, locale FROM users WHERE id = ? AND deleted_at IS NULL',
      [payload.sub]
    );
    if (rows.length && rows[0].account_status === 'active') req.user = rows[0];
    else clearAuthCookie(res);
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      clearAuthCookie(res);
      return next();
    }
    return next(error);
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
  return next();
};

function makeTokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashCampusId(value) {
  if (!value) return null;
  return crypto.createHmac('sha256', config.campusIdPepper).update(value.trim().toUpperCase()).digest('hex');
}

async function deleteUploadedFiles(files) {
  const paths = (files || []).filter(file => file.filename).map(file => path.join(config.uploadDir, path.basename(file.filename)));
  const results = await Promise.allSettled(paths.map(filePath => fs.unlink(filePath)));
  for (const result of results) {
    if (result.status === 'rejected' && result.reason.code !== 'ENOENT') {
      console.error('Unable to remove uploaded file:', result.reason.message);
    }
  }
}

module.exports = {
  cleanText, validators, validationErrors, setAuthCookie, clearAuthCookie,
  authenticate, optionalAuthenticate, requireRole, makeTokenHash, hashCampusId, deleteUploadedFiles
};
