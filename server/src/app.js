const crypto = require('node:crypto');
const express = require('express');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const { body, param } = require('express-validator');
const db = require('./db');
const { config } = require('./config');
const { sendMail } = require('./mailer');
const {
  cleanText, validators, validationErrors, setAuthCookie, clearAuthCookie,
  authenticate, optionalAuthenticate, requireRole, makeTokenHash, hashCampusId, deleteUploadedFiles
} = require('./security');
const { uploadImages, actualImageType, safeUploadPath, persistImages, removeStoredImages } = require('./uploads');

const app = express();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
const postLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.get('origin')) {
    try {
      if (new URL(req.get('origin')).origin !== new URL(config.appOrigin).origin) {
        return res.status(403).json({ error: 'Request origin is not allowed' });
      }
    } catch {
      return res.status(403).json({ error: 'Request origin is not allowed' });
    }
  }
  return next();
});
app.use(express.static(path.resolve(__dirname, '../../client')));

const emailLooksLikeDu = email => /@(?:du\.ac\.bd|student\.du\.ac\.bd)$/i.test(email);
const makeRawToken = () => crypto.randomBytes(32).toString('hex');
const datePlusMinutes = minutes => new Date(Date.now() + minutes * 60 * 1000);
const notFound = res => res.status(404).json({ error: 'Not found' });
const pageWindow = (page, limit) => ({
  page: Math.max(1, Math.min(Number.parseInt(page, 10) || 1, 100000)),
  limit: Math.max(1, Math.min(Number.parseInt(limit, 10) || 12, 50))
});

async function createNotification(connection, userId, eventType, payload) {
  await connection.execute(
    'INSERT INTO notifications (user_id, event_type, payload) VALUES (?, ?, ?)',
    [userId, eventType, JSON.stringify(payload)]
  );
}

async function notifyUser(userId, eventType, payload) {
  await createNotification(db, userId, eventType, payload);
}

async function getItem(id) {
  const [rows] = await db.execute(
    `SELECT i.id, i.user_id, i.category_id, i.location_id, i.item_type, i.title,
      i.public_description, i.occurred_at, i.extra_location_text, i.contact_preference,
      i.handover_details, i.moderation_status, i.moderation_note, i.status,
      i.expires_at, i.created_at, i.updated_at, i.private_details,
      u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone,
      u.du_verified_at, c.name_en AS category_en, c.name_bn AS category_bn,
      l.name_en AS location_en, l.name_bn AS location_bn,
      l.location_type AS location_type
     FROM items i
     JOIN users u ON u.id = i.user_id
     JOIN categories c ON c.id = i.category_id
     JOIN locations l ON l.id = i.location_id
     WHERE i.id = ? AND i.deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

async function getImages(itemId) {
  const [rows] = await db.execute(
    'SELECT storage_path, mime_type FROM item_images WHERE item_id = ? ORDER BY display_order',
    [itemId]
  );
  return rows.map(image => ({ url: `/api/items/${itemId}/images/${image.storage_path}`, mimeType: image.mime_type }));
}

function publicItem(item, images, options = {}) {
  const result = {
    id: item.id,
    itemType: item.item_type,
    title: item.title,
    description: item.public_description,
    occurredAt: item.occurred_at,
    extraLocationText: item.extra_location_text,
    handoverDetails: item.handover_details,
    status: item.status,
    moderationStatus: item.moderation_status,
    moderationNote: item.moderation_note,
    category: { id: item.category_id, en: item.category_en, bn: item.category_bn },
    location: { id: item.location_id, en: item.location_en, bn: item.location_bn, type: item.location_type },
    postedBy: { id: item.user_id, name: item.owner_name, duVerified: Boolean(item.du_verified_at) },
    images,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  };
  if (options.includePrivate && Number(item.user_id) === Number(options.viewerId)) {
    result.privateDetails = item.private_details;
    result.contactPreference = item.contact_preference;
    result.moderationNote = item.moderation_note;
  }
  if (options.contact) result.contact = options.contact;
  return result;
}

app.get('/api/health', async (_req, res) => {
  await db.query('SELECT 1');
  res.json({ status: 'ok', database: 'connected' });
});

app.post('/api/auth/register', validators.register, validationErrors, async (req, res) => {
  const name = cleanText(req.body.name, 120);
  const email = req.body.email.toLowerCase();
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const [result] = await db.execute(
    `INSERT INTO users (name, email, password_hash, affiliation, department_or_hall, campus_id_hash, locale)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name, email, passwordHash, req.body.affiliation || 'other',
      cleanText(req.body.departmentOrHall || '', 160) || null,
      hashCampusId(req.body.studentId), req.body.locale === 'bn' ? 'bn' : 'en'
    ]
  );
  const token = makeRawToken();
  await db.execute(
    'INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [result.insertId, makeTokenHash(token), datePlusMinutes(60 * 24)]
  );
  await sendMail({
    to: email,
    subject: 'Verify your DU Lost & Found account',
    text: `Open ${config.appOrigin}/#verify?token=${token} to verify your email address. This link expires in 24 hours.`
  });
  res.status(201).json({
    message: 'Account created. Verify your email to receive a DU badge.',
    user: { id: result.insertId, name, email, duVerified: false }
  });
});

app.post('/api/auth/login', loginLimiter, validators.login, validationErrors, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, password_hash, role, account_status, du_verified_at FROM users WHERE email = ? AND deleted_at IS NULL',
    [req.body.email.toLowerCase()]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
    return res.status(401).json({ error: 'Email or password is incorrect' });
  }
  if (user.account_status !== 'active') return res.status(403).json({ error: 'This account cannot sign in' });
  setAuthCookie(res, user);
  res.json({ message: 'Signed in', user: { id: user.id, name: user.name, email: user.email, role: user.role, duVerified: Boolean(user.du_verified_at) } });
});

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Signed out' });
});

app.post('/api/auth/verify-email', [
  body('token').isHexadecimal().isLength({ min: 64, max: 64 })
], validationErrors, async (req, res) => {
  const tokenHash = makeTokenHash(req.body.token);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [tokens] = await connection.execute(
      'SELECT id, user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP() FOR UPDATE',
      [tokenHash]
    );
    if (!tokens.length) {
      await connection.rollback();
      return res.status(400).json({ error: 'Verification link is invalid or expired' });
    }
    await connection.execute('UPDATE email_verification_tokens SET used_at = UTC_TIMESTAMP() WHERE id = ?', [tokens[0].id]);
    await connection.execute(
      `UPDATE users SET email_verified_at = UTC_TIMESTAMP(),
        du_verified_at = IF(email LIKE '%@du.ac.bd' OR email LIKE '%@student.du.ac.bd', UTC_TIMESTAMP(), du_verified_at)
       WHERE id = ?`,
      [tokens[0].user_id]
    );
    await connection.commit();
    res.json({ message: 'Email verified' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.post('/api/auth/forgot-password', loginLimiter, [
  body('email').isEmail().normalizeEmail()
], validationErrors, async (req, res) => {
  const [users] = await db.execute('SELECT id, email FROM users WHERE email = ? AND deleted_at IS NULL', [req.body.email.toLowerCase()]);
  if (users.length) {
    const token = makeRawToken();
    await db.execute(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [users[0].id, makeTokenHash(token), datePlusMinutes(30)]
    );
    await sendMail({
      to: users[0].email,
      subject: 'Reset your DU Lost & Found password',
      text: `Open ${config.appOrigin}/#reset?token=${token} to reset your password. This link expires in 30 minutes.`
    });
  }
  res.json({ message: 'If that account exists, password reset instructions have been sent.' });
});

app.post('/api/auth/reset-password', loginLimiter, [
  body('token').isHexadecimal().isLength({ min: 64, max: 64 }),
  body('password').isString().isLength({ min: 10, max: 128 })
], validationErrors, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [tokens] = await connection.execute(
      'SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP() FOR UPDATE',
      [makeTokenHash(req.body.token)]
    );
    if (!tokens.length) {
      await connection.rollback();
      return res.status(400).json({ error: 'Reset link is invalid or expired' });
    }
    const hash = await bcrypt.hash(req.body.password, 12);
    await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, tokens[0].user_id]);
    await connection.execute(
      'UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL',
      [tokens[0].user_id]
    );
    await connection.commit();
    res.json({ message: 'Password updated. Sign in with your new password.' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.get('/api/me', authenticate, (req, res) => {
  const { id, name, email, phone, role, affiliation, department_or_hall, du_verified_at, locale } = req.user;
  res.json({
    user: {
      id, name, email, phone, role, affiliation, departmentOrHall: department_or_hall,
      duVerified: Boolean(du_verified_at), locale
    }
  });
});

app.patch('/api/me', authenticate, [
  body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('phone').optional({ values: 'null' }).isString().isLength({ max: 32 }),
  body('affiliation').optional().isIn(['student', 'teacher', 'staff', 'hall_resident', 'other']),
  body('departmentOrHall').optional({ values: 'null' }).isString().isLength({ max: 160 }),
  body('locale').optional().isIn(['en', 'bn'])
], validationErrors, async (req, res) => {
  const updates = [];
  const values = [];
  const fields = {
    name: ['name', 120],
    phone: ['phone', 32],
    affiliation: ['affiliation', null],
    departmentOrHall: ['department_or_hall', 160],
    locale: ['locale', null]
  };
  for (const [input, [column, max]] of Object.entries(fields)) {
    if (req.body[input] !== undefined) {
      updates.push(`${column} = ?`);
      values.push(max ? cleanText(req.body[input], max) : req.body[input]);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'No profile fields supplied' });
  values.push(req.user.id);
  await db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
  res.json({ message: 'Profile updated' });
});

app.get('/api/categories', async (_req, res) => {
  const [rows] = await db.execute('SELECT id, name_en AS en, name_bn AS bn FROM categories WHERE is_active = TRUE ORDER BY name_en');
  res.json({ categories: rows });
});

app.get('/api/admin/categories', authenticate, requireRole('admin', 'moderator'), async (_req, res) => {
  const [categories] = await db.execute(
    'SELECT id, name_en AS en, name_bn AS bn, is_active AS isActive FROM categories ORDER BY name_en'
  );
  res.json({ categories });
});

app.get('/api/locations', async (_req, res) => {
  const [rows] = await db.execute(
    'SELECT id, parent_id AS parentId, name_en AS en, name_bn AS bn, location_type AS type FROM locations WHERE is_active = TRUE ORDER BY location_type, sort_order, name_en'
  );
  res.json({ locations: rows });
});

app.get('/api/admin/locations', authenticate, requireRole('admin', 'moderator'), async (_req, res) => {
  const [locations] = await db.execute(
    `SELECT id, parent_id AS parentId, name_en AS en, name_bn AS bn,
      location_type AS type, is_active AS isActive, sort_order AS sortOrder
     FROM locations ORDER BY location_type, sort_order, name_en`
  );
  res.json({ locations });
});

app.get('/api/items', optionalAuthenticate, async (req, res) => {
  const { page, limit } = pageWindow(req.query.page, req.query.limit);
  const where = ['i.deleted_at IS NULL', 'i.moderation_status = ?'];
  const values = ['approved'];
  if (!req.user) {
    where.push('i.item_type = ?');
    values.push('found');
  }
  if (req.query.type && ['lost', 'found'].includes(req.query.type)) {
    where.push('i.item_type = ?');
    values.push(req.query.type);
  }
  if (req.query.status && ['open', 'claim_pending', 'returned', 'archived'].includes(req.query.status)) {
    where.push('i.status = ?');
    values.push(req.query.status);
  } else {
    where.push('i.status IN (?, ?)');
    values.push('open', 'claim_pending');
  }
  if (req.query.categoryId && /^\d+$/.test(req.query.categoryId)) {
    where.push('i.category_id = ?');
    values.push(Number(req.query.categoryId));
  }
  if (req.query.locationId && /^\d+$/.test(req.query.locationId)) {
    where.push('i.location_id = ?');
    values.push(Number(req.query.locationId));
  }
  if (req.query.from && !Number.isNaN(Date.parse(req.query.from))) {
    where.push('i.occurred_at >= ?');
    values.push(new Date(req.query.from));
  }
  if (req.query.to && !Number.isNaN(Date.parse(req.query.to))) {
    where.push('i.occurred_at < DATE_ADD(?, INTERVAL 1 DAY)');
    values.push(new Date(req.query.to));
  }
  const keyword = typeof req.query.q === 'string' ? cleanText(req.query.q, 120) : '';
  if (keyword) {
    const like = `%${keyword.replace(/[\\%_]/g, '\\$&')}%`;
    where.push('(i.title LIKE ? OR i.public_description LIKE ? OR l.name_en LIKE ? OR l.name_bn LIKE ?)');
    values.push(like, like, like, like);
  }
  const [rows] = await db.execute(
    `SELECT i.id, i.user_id, i.category_id, i.location_id, i.item_type, i.title,
       i.public_description, i.occurred_at, i.extra_location_text, i.handover_details,
       i.moderation_status, i.status, i.created_at,
       u.name AS owner_name, u.du_verified_at, c.name_en AS category_en, c.name_bn AS category_bn,
       l.name_en AS location_en, l.name_bn AS location_bn, l.location_type
     FROM items i JOIN users u ON u.id = i.user_id
     JOIN categories c ON c.id = i.category_id JOIN locations l ON l.id = i.location_id
     WHERE ${where.join(' AND ')}
     ORDER BY i.created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, (page - 1) * limit]
  );
  const [count] = await db.execute(
    `SELECT COUNT(*) AS total FROM items i JOIN locations l ON l.id = i.location_id WHERE ${where.join(' AND ')}`,
    values
  );
  const items = await Promise.all(rows.map(async item => publicItem(item, await getImages(item.id))));
  res.json({ items, pagination: { page, limit, total: count[0].total, pages: Math.ceil(count[0].total / limit) } });
});

app.post('/api/items', authenticate, postLimiter, (req, res, next) => {
  uploadImages(req, res, error => {
    if (error) return next(error);
    next();
  });
}, validators.post, validationErrors, async (req, res) => {
  const files = req.files || [];
  for (const file of files) {
    const type = await actualImageType(file.buffer);
    if (!type || type !== file.mimetype) {
      await deleteUploadedFiles(files);
      return res.status(400).json({ error: 'An uploaded file is not a valid supported image.' });
    }
  }
  const [categories] = await db.execute('SELECT id FROM categories WHERE id = ? AND is_active = TRUE', [req.body.categoryId]);
  const [locations] = await db.execute('SELECT id FROM locations WHERE id = ? AND is_active = TRUE', [req.body.locationId]);
  if (!categories.length || !locations.length) {
    await deleteUploadedFiles(files);
    return res.status(400).json({ error: 'Choose an active category and location.' });
  }
  await persistImages(files);
  const connection = await db.getConnection();
  let itemId;
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO items
        (user_id, category_id, location_id, item_type, title, public_description, private_details,
         occurred_at, extra_location_text, contact_preference, handover_details, moderation_status, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'open', DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? DAY))`,
      [
        req.user.id, req.body.categoryId, req.body.locationId, req.body.itemType,
        cleanText(req.body.title, 180), cleanText(req.body.description, 5000),
        cleanText(req.body.privateDetails || '', 1500) || null, req.body.occurredAt,
        cleanText(req.body.extraLocationText || '', 240) || null,
        req.body.contactPreference || 'internal_message',
        cleanText(req.body.handoverDetails || '', 500) || null, config.itemExpiryDays
      ]
    );
    itemId = result.insertId;
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      await connection.execute(
        'INSERT INTO item_images (item_id, storage_path, mime_type, file_size_bytes, display_order) VALUES (?, ?, ?, ?, ?)',
        [itemId, file.filename, file.mimetype, file.size, index]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    await deleteUploadedFiles(files);
    throw error;
  } finally {
    connection.release();
  }
  await notifyUser(req.user.id, 'item_submitted', { itemId, title: cleanText(req.body.title, 180) });
  res.status(201).json({ message: 'Post submitted for moderator approval', item: await getItem(itemId) && { id: itemId, moderationStatus: 'pending', status: 'open' } });
});

app.get('/api/items/:id', optionalAuthenticate, [
  param('id').isInt({ min: 1 }).toInt()
], validationErrors, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item) return notFound(res);
  const isOwner = req.user && Number(req.user.id) === Number(item.user_id);
  const isAdmin = req.user && ['admin', 'moderator'].includes(req.user.role);
  if ((!req.user && (item.item_type !== 'found' || item.moderation_status !== 'approved')) ||
      (req.user && !isOwner && !isAdmin && item.moderation_status !== 'approved')) return notFound(res);
  let contact = null;
  if (req.user && !isOwner) {
    const [claims] = await db.execute(
      'SELECT id, status FROM claims WHERE item_id = ? AND claimant_id = ? AND status = ?',
      [item.id, req.user.id, 'approved']
    );
    if (claims.length) {
      await db.execute('UPDATE claims SET contact_shared_at = COALESCE(contact_shared_at, UTC_TIMESTAMP()) WHERE id = ?', [claims[0].id]);
      contact = item.contact_preference === 'email' ? { email: item.owner_email } :
        item.contact_preference === 'phone' ? { phone: item.owner_phone } : { via: 'claim-messages' };
    }
  }
  res.json({ item: publicItem(item, await getImages(item.id), { viewerId: req.user?.id, includePrivate: isOwner, contact }) });
});

app.get('/api/items/:id/images/:filename', optionalAuthenticate, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item || path.basename(req.params.filename) !== req.params.filename) return notFound(res);
  const isOwner = req.user && Number(req.user.id) === Number(item.user_id);
  const isAdmin = req.user && ['admin', 'moderator'].includes(req.user.role);
  let isApprovedClaimant = false;
  if (req.user && !isOwner && !isAdmin) {
    const [claims] = await db.execute('SELECT id FROM claims WHERE item_id = ? AND claimant_id = ? AND status = ?', [item.id, req.user.id, 'approved']);
    isApprovedClaimant = claims.length > 0;
  }
  const canView = item.moderation_status === 'approved' && (item.item_type === 'found' || req.user) || isOwner || isAdmin || isApprovedClaimant;
  if (!canView) return notFound(res);
  const [images] = await db.execute('SELECT mime_type FROM item_images WHERE item_id = ? AND storage_path = ?', [item.id, req.params.filename]);
  if (!images.length) return notFound(res);
  res.type(images[0].mime_type).sendFile(safeUploadPath(req.params.filename));
});

app.patch('/api/items/:id', authenticate, postLimiter, (req, res, next) => {
  uploadImages(req, res, error => {
    if (error) return next(error);
    next();
  });
}, validators.post, validationErrors, async (req, res) => {
  const files = req.files || [];
  for (const file of files) {
    const type = await actualImageType(file.buffer);
    if (!type || type !== file.mimetype) {
      await deleteUploadedFiles(files);
      return res.status(400).json({ error: 'An uploaded file is not a valid supported image.' });
    }
  }
  const item = await getItem(req.params.id);
  if (!item || Number(item.user_id) !== Number(req.user.id)) {
    await deleteUploadedFiles(files);
    return notFound(res);
  }
  if (item.status !== 'open') {
    await deleteUploadedFiles(files);
    return res.status(409).json({ error: 'Only open posts can be edited.' });
  }
  const [categories] = await db.execute('SELECT id FROM categories WHERE id = ? AND is_active = TRUE', [req.body.categoryId]);
  const [locations] = await db.execute('SELECT id FROM locations WHERE id = ? AND is_active = TRUE', [req.body.locationId]);
  if (!categories.length || !locations.length) {
    await deleteUploadedFiles(files);
    return res.status(400).json({ error: 'Choose an active category and location.' });
  }
  const [oldImages] = files.length
    ? await db.execute('SELECT storage_path FROM item_images WHERE item_id = ?', [item.id])
    : [[]];
  await persistImages(files);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE items SET category_id = ?, location_id = ?, item_type = ?, title = ?,
        public_description = ?, private_details = ?, occurred_at = ?, extra_location_text = ?,
        contact_preference = ?, handover_details = ?, moderation_status = 'pending', moderation_note = NULL
       WHERE id = ?`,
      [
        req.body.categoryId, req.body.locationId, req.body.itemType, cleanText(req.body.title, 180),
        cleanText(req.body.description, 5000), cleanText(req.body.privateDetails || '', 1500) || null,
        req.body.occurredAt, cleanText(req.body.extraLocationText || '', 240) || null,
        req.body.contactPreference || 'internal_message',
        cleanText(req.body.handoverDetails || '', 500) || null, item.id
      ]
    );
    if (files.length) {
      await connection.execute('DELETE FROM item_images WHERE item_id = ?', [item.id]);
      for (let index = 0; index < files.length; index += 1) {
        await connection.execute(
          'INSERT INTO item_images (item_id, storage_path, mime_type, file_size_bytes, display_order) VALUES (?, ?, ?, ?, ?)',
          [item.id, files[index].filename, files[index].mimetype, files[index].size, index]
        );
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    await deleteUploadedFiles(files);
    throw error;
  } finally {
    connection.release();
  }
  if (files.length) {
    await removeStoredImages(oldImages.map(image => image.storage_path));
  }
  res.json({ message: 'Post updated and sent for moderator review', moderationStatus: 'pending' });
});

app.delete('/api/items/:id', authenticate, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item || Number(item.user_id) !== Number(req.user.id)) return notFound(res);
  if (item.status === 'claim_pending') return res.status(409).json({ error: 'Resolve pending claims before deleting this post' });
  const [images] = await db.execute(
    'SELECT storage_path FROM item_images WHERE item_id = ?',
    [req.params.id]
  );
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      'UPDATE items SET deleted_at = UTC_TIMESTAMP() WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
      [req.params.id, req.user.id]
    );
    if (!result.affectedRows) {
      await connection.rollback();
      return notFound(res);
    }
    await connection.execute('DELETE FROM item_images WHERE item_id = ?', [req.params.id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  await removeStoredImages(images.map(image => image.storage_path));
  res.json({ message: 'Post deleted' });
});

app.post('/api/items/:id/claims', authenticate, postLimiter, validators.claim, validationErrors, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item || item.moderation_status !== 'approved' || item.item_type !== 'found') return notFound(res);
  if (Number(item.user_id) === Number(req.user.id)) return res.status(400).json({ error: 'You cannot claim your own post' });
  if (item.status !== 'open' && item.status !== 'claim_pending') return res.status(409).json({ error: 'This item is not accepting claims' });
  if (item.expires_at && new Date(item.expires_at).getTime() <= Date.now()) {
    await db.execute('UPDATE items SET status = ? WHERE id = ?', ['archived', item.id]);
    return res.status(409).json({ error: 'This item has expired and no longer accepts claims' });
  }

  const connection = await db.getConnection();
  let claimId;
  try {
    await connection.beginTransaction();
    const [existing] = await connection.execute(
      'SELECT id FROM claims WHERE item_id = ? AND claimant_id = ?',
      [item.id, req.user.id]
    );
    if (existing.length) {
      await connection.rollback();
      return res.status(409).json({ error: 'You have already submitted a claim for this item' });
    }
    const [result] = await connection.execute(
      'INSERT INTO claims (item_id, claimant_id, proof_answer) VALUES (?, ?, ?)',
      [item.id, req.user.id, cleanText(req.body.proofAnswer, 2000)]
    );
    claimId = result.insertId;
    await connection.execute('UPDATE items SET status = ? WHERE id = ?', ['claim_pending', item.id]);
    await createNotification(connection, item.user_id, 'claim_received', { claimId, itemId: item.id, title: item.title });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'You have already submitted a claim for this item' });
    throw error;
  } finally {
    connection.release();
  }
  res.status(201).json({ message: 'Claim sent to the item poster for review', claim: { id: claimId, status: 'pending', itemId: item.id } });
});

app.get('/api/claims', authenticate, async (req, res) => {
  const [claims] = await db.execute(
    `SELECT cl.id, cl.item_id AS itemId, cl.status, cl.review_note AS reviewNote,
      cl.created_at AS createdAt, cl.reviewed_at AS reviewedAt, i.title AS itemTitle,
      i.item_type AS itemType, i.status AS itemStatus, i.user_id AS ownerId,
      u.name AS claimantName
     FROM claims cl JOIN items i ON i.id = cl.item_id JOIN users u ON u.id = cl.claimant_id
     WHERE cl.claimant_id = ? ORDER BY cl.created_at DESC LIMIT 100`,
    [req.user.id]
  );
  res.json({ claims });
});

app.get('/api/items/:id/claims', authenticate, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item) return notFound(res);
  if (Number(item.user_id) !== Number(req.user.id) && !['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only the item owner or a moderator may review claims' });
  }
  const [claims] = await db.execute(
    `SELECT cl.id, cl.claimant_id AS claimantId, cl.proof_answer AS proofAnswer,
      cl.status, cl.review_note AS reviewNote, cl.created_at AS createdAt,
      cl.reviewed_at AS reviewedAt, u.name AS claimantName,
      u.du_verified_at AS claimantDuVerifiedAt
     FROM claims cl JOIN users u ON u.id = cl.claimant_id
     WHERE cl.item_id = ? ORDER BY cl.created_at DESC`,
    [item.id]
  );
  res.json({ claims: claims.map(claim => ({ ...claim, claimantDuVerified: Boolean(claim.claimantDuVerifiedAt), claimantDuVerifiedAt: undefined })) });
});

app.get('/api/claims/:id', authenticate, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT cl.id, cl.item_id AS itemId, cl.claimant_id AS claimantId, cl.proof_answer AS proofAnswer,
      cl.status, cl.review_note AS reviewNote, cl.created_at AS createdAt, cl.reviewed_at AS reviewedAt,
      i.user_id AS ownerId, i.title, i.contact_preference AS contactPreference,
      owner.email AS ownerEmail, owner.phone AS ownerPhone
     FROM claims cl JOIN items i ON i.id = cl.item_id
     JOIN users owner ON owner.id = i.user_id WHERE cl.id = ?`,
    [req.params.id]
  );
  const claim = rows[0];
  if (!claim) return notFound(res);
  const ownerView = Number(claim.ownerId) === Number(req.user.id) || ['admin', 'moderator'].includes(req.user.role);
  const claimantView = Number(claim.claimantId) === Number(req.user.id);
  if (!ownerView && !claimantView) return notFound(res);
  const response = {
    id: claim.id, itemId: claim.itemId, title: claim.title, status: claim.status,
    reviewNote: claim.reviewNote, createdAt: claim.createdAt, reviewedAt: claim.reviewedAt
  };
  if (ownerView) response.proofAnswer = claim.proofAnswer;
  if (claimantView && claim.status === 'approved') {
    response.contact = claim.contactPreference === 'email' ? { email: claim.ownerEmail } :
      claim.contactPreference === 'phone' ? { phone: claim.ownerPhone } : { via: 'claim-messages' };
    await db.execute('UPDATE claims SET contact_shared_at = COALESCE(contact_shared_at, UTC_TIMESTAMP()) WHERE id = ?', [claim.id]);
  }
  res.json({ claim: response });
});

app.patch('/api/claims/:id/review', authenticate, [
  body('decision').isIn(['approved', 'rejected']),
  body('reviewNote').optional({ values: 'falsy' }).isString().isLength({ max: 500 })
], validationErrors, async (req, res) => {
  const connection = await db.getConnection();
  let notifyClaimant;
  let itemId;
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      `SELECT cl.id, cl.item_id, cl.claimant_id, cl.status, i.user_id AS owner_id, i.title, i.status AS item_status
       FROM claims cl JOIN items i ON i.id = cl.item_id WHERE cl.id = ? FOR UPDATE`,
      [req.params.id]
    );
    const claim = rows[0];
    if (!claim) {
      await connection.rollback();
      return notFound(res);
    }
    if (Number(claim.owner_id) !== Number(req.user.id) && !['admin', 'moderator'].includes(req.user.role)) {
      await connection.rollback();
      return res.status(403).json({ error: 'Only the item owner or a moderator may review claims' });
    }
    if (claim.status !== 'pending') {
      await connection.rollback();
      return res.status(409).json({ error: 'This claim has already been reviewed' });
    }
    if (['returned', 'archived'].includes(claim.item_status)) {
      await connection.rollback();
      return res.status(409).json({ error: 'This item is no longer accepting claim decisions' });
    }
    const note = cleanText(req.body.reviewNote || '', 500) || null;
    await connection.execute(
      'UPDATE claims SET status = ?, reviewed_by = ?, review_note = ?, reviewed_at = UTC_TIMESTAMP() WHERE id = ?',
      [req.body.decision, req.user.id, note, claim.id]
    );
    itemId = claim.item_id;
    notifyClaimant = claim.claimant_id;
    if (req.body.decision === 'approved') {
      await connection.execute('UPDATE items SET status = ? WHERE id = ?', ['returned', itemId]);
      const [otherClaims] = await connection.execute(
        'SELECT id, claimant_id FROM claims WHERE item_id = ? AND id <> ? AND status = ?',
        [itemId, claim.id, 'pending']
      );
      await connection.execute(
        `UPDATE claims SET status = 'rejected', review_note = 'Another claim was approved',
          reviewed_by = ?, reviewed_at = UTC_TIMESTAMP()
         WHERE item_id = ? AND id <> ? AND status = 'pending'`,
        [req.user.id, itemId, claim.id]
      );
      for (const otherClaim of otherClaims) {
        await createNotification(connection, otherClaim.claimant_id, 'claim_rejected', {
          claimId: otherClaim.id, itemId, title: claim.title, note: 'Another claim was approved'
        });
      }
    } else {
      const [pending] = await connection.execute('SELECT id FROM claims WHERE item_id = ? AND status = ? AND id <> ?', [itemId, 'pending', claim.id]);
      if (!pending.length) await connection.execute('UPDATE items SET status = ? WHERE id = ? AND status = ?', ['open', itemId, 'claim_pending']);
    }
    await createNotification(connection, notifyClaimant, `claim_${req.body.decision}`, { claimId: claim.id, itemId, title: claim.title });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  res.json({ message: `Claim ${req.body.decision}`, claimId: Number(req.params.id), itemId });
});

app.get('/api/claims/:id/messages', authenticate, async (req, res) => {
  const [participants] = await db.execute(
    `SELECT cl.status, cl.claimant_id, i.user_id AS owner_id
     FROM claims cl JOIN items i ON i.id = cl.item_id WHERE cl.id = ?`,
    [req.params.id]
  );
  const claim = participants[0];
  if (!claim) return notFound(res);
  if (claim.status !== 'approved') return res.status(403).json({ error: 'Messages are available only after claim approval' });
  if (![Number(claim.claimant_id), Number(claim.owner_id)].includes(Number(req.user.id))) return notFound(res);
  const [messages] = await db.execute(
    `SELECT m.id, m.sender_id AS senderId, u.name AS senderName, m.body, m.created_at AS createdAt
     FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.claim_id = ? ORDER BY m.created_at`,
    [req.params.id]
  );
  res.json({ messages });
});

app.post('/api/claims/:id/messages', authenticate, validators.message, validationErrors, async (req, res) => {
  const [participants] = await db.execute(
    `SELECT cl.status, cl.claimant_id, i.user_id AS owner_id
     FROM claims cl JOIN items i ON i.id = cl.item_id WHERE cl.id = ?`,
    [req.params.id]
  );
  const claim = participants[0];
  if (!claim) return notFound(res);
  if (claim.status !== 'approved') return res.status(403).json({ error: 'Messages are available only after claim approval' });
  const participantIds = [Number(claim.claimant_id), Number(claim.owner_id)];
  if (!participantIds.includes(Number(req.user.id))) return notFound(res);
  const [result] = await db.execute(
    'INSERT INTO messages (claim_id, sender_id, body) VALUES (?, ?, ?)',
    [req.params.id, req.user.id, cleanText(req.body.body, 3000)]
  );
  const recipient = participantIds.find(id => id !== Number(req.user.id));
  await notifyUser(recipient, 'new_message', { claimId: Number(req.params.id), messageId: result.insertId });
  res.status(201).json({ message: { id: result.insertId, senderId: req.user.id, body: cleanText(req.body.body, 3000) } });
});

app.post('/api/items/:id/reports', authenticate, [
  body('reason').isIn(['spam', 'fake', 'inappropriate', 'privacy', 'other']),
  body('details').optional({ values: 'falsy' }).isString().isLength({ max: 1000 })
], validationErrors, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item || Number(item.user_id) === Number(req.user.id)) return notFound(res);
  const [result] = await db.execute(
    'INSERT INTO reports (reporter_id, item_id, reason, details) VALUES (?, ?, ?, ?)',
    [req.user.id, item.id, req.body.reason, cleanText(req.body.details || '', 1000) || null]
  );
  res.status(201).json({ message: 'Report sent to moderators', reportId: result.insertId });
});

app.get('/api/notifications', authenticate, async (req, res) => {
  const [notifications] = await db.execute(
    `SELECT id, event_type AS eventType, payload, read_at AS readAt, created_at AS createdAt
     FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`,
    [req.user.id]
  );
  res.json({ notifications: notifications.map(item => ({ ...item, payload: typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload })) });
});

app.patch('/api/notifications/:id/read', authenticate, async (req, res) => {
  const [result] = await db.execute(
    'UPDATE notifications SET read_at = COALESCE(read_at, UTC_TIMESTAMP()) WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return notFound(res);
  res.json({ message: 'Notification marked as read' });
});

app.get('/api/dashboard', authenticate, async (req, res) => {
  const [items] = await db.execute(
    `SELECT i.id, i.title, i.item_type AS itemType, i.moderation_status AS moderationStatus,
      i.status, i.created_at AS createdAt, c.name_en AS categoryEn, c.name_bn AS categoryBn,
      l.name_en AS locationEn, l.name_bn AS locationBn
     FROM items i JOIN categories c ON c.id = i.category_id JOIN locations l ON l.id = i.location_id
     WHERE i.user_id = ? AND i.deleted_at IS NULL ORDER BY i.created_at DESC LIMIT 100`,
    [req.user.id]
  );
  const [claims] = await db.execute(
    `SELECT cl.id, cl.item_id AS itemId, cl.status, cl.review_note AS reviewNote,
      cl.created_at AS createdAt, i.title AS itemTitle, i.item_type AS itemType
     FROM claims cl JOIN items i ON i.id = cl.item_id
     WHERE cl.claimant_id = ? ORDER BY cl.created_at DESC LIMIT 100`,
    [req.user.id]
  );
  const [notifications] = await db.execute(
    `SELECT id, event_type AS eventType, payload, read_at AS readAt, created_at AS createdAt
     FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    [req.user.id]
  );
  res.json({
    items, claims,
    notifications: notifications.map(item => ({ ...item, payload: typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload }))
  });
});

app.get('/api/admin/overview', authenticate, requireRole('admin', 'moderator'), async (_req, res) => {
  const [counts] = await db.execute(
    `SELECT
      (SELECT COUNT(*) FROM items WHERE deleted_at IS NULL) AS totalItems,
      (SELECT COUNT(*) FROM items WHERE moderation_status = 'pending' AND deleted_at IS NULL) AS pendingPosts,
      (SELECT COUNT(*) FROM claims WHERE status = 'pending') AS pendingClaims,
      (SELECT COUNT(*) FROM users WHERE account_status = 'active' AND deleted_at IS NULL) AS activeUsers,
      (SELECT COUNT(*) FROM reports WHERE status IN ('open', 'reviewing')) AS openReports,
      (SELECT COUNT(*) FROM items WHERE status = 'returned' AND deleted_at IS NULL) AS returnedItems,
      (SELECT COUNT(*) FROM items WHERE deleted_at IS NULL AND moderation_status = 'approved') AS approvedItems`
  );
  const [byLocation] = await db.execute(
    `SELECT l.id, l.name_en AS en, l.name_bn AS bn, COUNT(i.id) AS itemCount
     FROM locations l LEFT JOIN items i ON i.location_id = l.id AND i.deleted_at IS NULL
     GROUP BY l.id ORDER BY itemCount DESC, l.sort_order, l.name_en`
  );
  const total = Number(counts[0].approvedItems) || 0;
  const returned = Number(counts[0].returnedItems) || 0;
  res.json({
    stats: {
      ...counts[0],
      returnRate: total ? Number(((returned / total) * 100).toFixed(1)) : 0
    },
    itemsByLocation: byLocation
  });
});

app.get('/api/admin/items', authenticate, requireRole('admin', 'moderator'), async (req, res) => {
  const status = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : 'pending';
  const [rows] = await db.execute(
    `SELECT i.id, i.user_id AS userId, i.item_type AS itemType, i.title, i.public_description AS description,
      i.occurred_at AS occurredAt, i.moderation_status AS moderationStatus, i.moderation_note AS moderationNote,
      i.status, i.created_at AS createdAt, u.name AS postedBy, u.email AS posterEmail,
      c.name_en AS categoryEn, c.name_bn AS categoryBn, l.name_en AS locationEn, l.name_bn AS locationBn
     FROM items i JOIN users u ON u.id = i.user_id JOIN categories c ON c.id = i.category_id
     JOIN locations l ON l.id = i.location_id
     WHERE i.moderation_status = ? AND i.deleted_at IS NULL ORDER BY i.created_at ASC LIMIT 100`,
    [status]
  );
  res.json({ items: rows });
});

app.patch('/api/admin/items/:id/moderate', authenticate, requireRole('admin', 'moderator'), [
  body('decision').isIn(['approved', 'rejected']),
  body('note').optional({ values: 'falsy' }).isString().isLength({ max: 500 })
], validationErrors, async (req, res) => {
  const item = await getItem(req.params.id);
  if (!item) return notFound(res);
  if (item.moderation_status !== 'pending') return res.status(409).json({ error: 'This post has already been reviewed' });
  const note = cleanText(req.body.note || '', 500) || null;
  const [result] = await db.execute(
    'UPDATE items SET moderation_status = ?, moderation_note = ? WHERE id = ? AND moderation_status = ?',
    [req.body.decision, note, item.id, 'pending']
  );
  if (!result.affectedRows) return res.status(409).json({ error: 'This post has already been reviewed' });
  await notifyUser(item.user_id, `item_${req.body.decision}`, { itemId: item.id, title: item.title, note });
  res.json({ message: `Post ${req.body.decision}`, itemId: item.id });
});

app.get('/api/admin/claims', authenticate, requireRole('admin', 'moderator'), async (_req, res) => {
  const [claims] = await db.execute(
    `SELECT cl.id, cl.item_id AS itemId, cl.claimant_id AS claimantId,
      cl.proof_answer AS proofAnswer, cl.status, cl.review_note AS reviewNote,
      cl.created_at AS createdAt, i.title AS itemTitle, owner.name AS ownerName,
      claimant.name AS claimantName
     FROM claims cl JOIN items i ON i.id = cl.item_id
     JOIN users owner ON owner.id = i.user_id JOIN users claimant ON claimant.id = cl.claimant_id
     WHERE cl.status = 'pending' ORDER BY cl.created_at ASC LIMIT 100`
  );
  res.json({ claims });
});

app.get('/api/admin/reports', authenticate, requireRole('admin', 'moderator'), async (_req, res) => {
  const [reports] = await db.execute(
    `SELECT r.id, r.reporter_id AS reporterId, r.item_id AS itemId, r.reason,
      r.details, r.status, r.created_at AS createdAt, i.title AS itemTitle,
      reporter.name AS reporterName
     FROM reports r JOIN items i ON i.id = r.item_id
     JOIN users reporter ON reporter.id = r.reporter_id
     WHERE r.status IN ('open', 'reviewing') ORDER BY r.created_at ASC LIMIT 100`
  );
  res.json({ reports });
});

app.patch('/api/admin/reports/:id', authenticate, requireRole('admin', 'moderator'), [
  body('status').isIn(['reviewing', 'resolved', 'dismissed'])
], validationErrors, async (req, res) => {
  const [result] = await db.execute(
    `UPDATE reports SET status = ?, reviewed_by = ?, reviewed_at = UTC_TIMESTAMP()
     WHERE id = ? AND status IN ('open', 'reviewing')`,
    [req.body.status, req.user.id, req.params.id]
  );
  if (!result.affectedRows) return notFound(res);
  res.json({ message: 'Report updated' });
});

app.get('/api/admin/users', authenticate, requireRole('admin'), async (req, res) => {
  const [users] = await db.execute(
    `SELECT id, name, email, role, account_status AS accountStatus, affiliation,
      department_or_hall AS departmentOrHall, du_verified_at AS duVerifiedAt, created_at AS createdAt
     FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
  );
  res.json({ users });
});

app.patch('/api/admin/users/:id/status', authenticate, requireRole('admin'), [
  body('status').isIn(['active', 'suspended', 'banned'])
], validationErrors, async (req, res) => {
  if (Number(req.params.id) === Number(req.user.id)) return res.status(400).json({ error: 'You cannot suspend or ban your own account' });
  const [target] = await db.execute('SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL', [req.params.id]);
  if (!target.length) return notFound(res);
  if (target[0].role === 'admin') return res.status(403).json({ error: 'Administrator accounts cannot be suspended here' });
  const [result] = await db.execute('UPDATE users SET account_status = ? WHERE id = ?', [req.body.status, req.params.id]);
  if (!result.affectedRows) return notFound(res);
  res.json({ message: `Account ${req.body.status}` });
});

app.post('/api/admin/categories', authenticate, requireRole('admin', 'moderator'), [
  body('nameEn').isString().trim().isLength({ min: 2, max: 100 }),
  body('nameBn').isString().trim().isLength({ min: 1, max: 100 })
], validationErrors, async (req, res) => {
  const [result] = await db.execute(
    'INSERT INTO categories (name_en, name_bn) VALUES (?, ?)',
    [cleanText(req.body.nameEn, 100), cleanText(req.body.nameBn, 100)]
  );
  res.status(201).json({ category: { id: result.insertId, en: cleanText(req.body.nameEn, 100), bn: cleanText(req.body.nameBn, 100) } });
});

app.patch('/api/admin/categories/:id', authenticate, requireRole('admin', 'moderator'), [
  body('nameEn').optional().isString().trim().isLength({ min: 2, max: 100 }),
  body('nameBn').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('isActive').optional().isBoolean().toBoolean()
], validationErrors, async (req, res) => {
  const updates = [];
  const values = [];
  if (req.body.nameEn !== undefined) { updates.push('name_en = ?'); values.push(cleanText(req.body.nameEn, 100)); }
  if (req.body.nameBn !== undefined) { updates.push('name_bn = ?'); values.push(cleanText(req.body.nameBn, 100)); }
  if (req.body.isActive !== undefined) { updates.push('is_active = ?'); values.push(req.body.isActive); }
  if (!updates.length) return res.status(400).json({ error: 'No category fields supplied' });
  values.push(req.params.id);
  const [result] = await db.execute(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return notFound(res);
  res.json({ message: 'Category updated' });
});

app.post('/api/admin/locations', authenticate, requireRole('admin', 'moderator'), [
  body('nameEn').isString().trim().isLength({ min: 2, max: 160 }),
  body('nameBn').isString().trim().isLength({ min: 1, max: 160 }),
  body('type').isIn(['academic', 'student_space', 'hall', 'transport', 'gate', 'other']),
  body('parentId').optional({ values: 'null' }).isInt({ min: 1 }).toInt(),
  body('sortOrder').optional().isInt({ min: 0, max: 10000 }).toInt()
], validationErrors, async (req, res) => {
  const [result] = await db.execute(
    `INSERT INTO locations (parent_id, name_en, name_bn, location_type, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      req.body.parentId || null, cleanText(req.body.nameEn, 160), cleanText(req.body.nameBn, 160),
      req.body.type, req.body.sortOrder || 0
    ]
  );
  res.status(201).json({
    location: {
      id: result.insertId, parentId: req.body.parentId || null,
      en: cleanText(req.body.nameEn, 160), bn: cleanText(req.body.nameBn, 160),
      type: req.body.type
    }
  });
});

app.patch('/api/admin/locations/:id', authenticate, requireRole('admin', 'moderator'), [
  body('nameEn').optional().isString().trim().isLength({ min: 2, max: 160 }),
  body('nameBn').optional().isString().trim().isLength({ min: 1, max: 160 }),
  body('type').optional().isIn(['academic', 'student_space', 'hall', 'transport', 'gate', 'other']),
  body('parentId').optional({ values: 'null' }).isInt({ min: 1 }).toInt(),
  body('sortOrder').optional().isInt({ min: 0, max: 10000 }).toInt(),
  body('isActive').optional().isBoolean().toBoolean()
], validationErrors, async (req, res) => {
  const updates = [];
  const values = [];
  const fields = {
    nameEn: ['name_en', value => cleanText(value, 160)],
    nameBn: ['name_bn', value => cleanText(value, 160)],
    type: ['location_type', value => value],
    parentId: ['parent_id', value => value || null],
    sortOrder: ['sort_order', value => value],
    isActive: ['is_active', value => value]
  };
  for (const [input, [column, convert]] of Object.entries(fields)) {
    if (req.body[input] !== undefined) {
      updates.push(`${column} = ?`);
      values.push(convert(req.body[input]));
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'No location fields supplied' });
  values.push(req.params.id);
  const [result] = await db.execute(`UPDATE locations SET ${updates.join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return notFound(res);
  res.json({ message: 'Location updated' });
});

app.get('/api/*path', (_req, res) => res.status(404).json({ error: 'API route not found' }));
app.get('*path', (_req, res) => res.status(404).sendFile(path.resolve(__dirname, '../../client/pages/404.html')));

app.use((error, req, res, _next) => {
  if (error instanceof require('multer').MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' || error.code === 'LIMIT_FILE_COUNT' ? 400 : 400;
    return res.status(status).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be within the upload size limit' : 'Upload contains too many files or fields' });
  }
  if (error.message === 'Images must be JPEG, PNG, or WebP.') return res.status(400).json({ error: error.message });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Request body must be valid JSON' });
  if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A record with the supplied unique value already exists' });
  console.error(error);
  if (res.headersSent) return;
  const message = config.nodeEnv === 'development' ? error.message : 'An unexpected server error occurred';
  res.status(500).json({ error: message });
});

async function expireItems() {
  await db.execute(
    `UPDATE items SET status = 'archived'
     WHERE status IN ('open', 'claim_pending') AND expires_at IS NOT NULL AND expires_at <= UTC_TIMESTAMP()`
  );
}

app.locals.expireItems = expireItems;

module.exports = app;
