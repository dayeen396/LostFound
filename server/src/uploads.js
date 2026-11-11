const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const { config } = require('./config');

fs.mkdirSync(config.uploadDir, { recursive: true });

const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes, files: 3, fields: 16 },
  fileFilter: (_req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new Error('Images must be JPEG, PNG, or WebP.'));
    }
    return callback(null, true);
  }
}).array('images', 3);

async function actualImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

async function persistImages(files) {
  const saved = [];
  try {
    for (const file of files) {
      file.filename = `${crypto.randomUUID()}.img`;
      file.path = safeUploadPath(file.filename);
      await fs.promises.writeFile(file.path, file.buffer, { flag: 'wx', mode: 0o600 });
      saved.push(file);
    }
    return saved;
  } catch (error) {
    const cleanup = await Promise.allSettled(saved.map(file => fs.promises.unlink(file.path)));
    for (const result of cleanup) {
      if (result.status === 'rejected' && result.reason.code !== 'ENOENT') {
        console.error('Unable to remove staged image:', result.reason.message);
      }
    }
    throw error;
  }
}

function safeUploadPath(filename) {
  return path.join(config.uploadDir, path.basename(filename));
}

async function removeStoredImages(filenames) {
  const results = await Promise.allSettled(filenames.map(filename => fs.promises.unlink(safeUploadPath(filename))));
  for (const result of results) {
    if (result.status === 'rejected' && result.reason.code !== 'ENOENT') {
      console.error('Unable to remove stored image:', result.reason.message);
    }
  }
}

module.exports = { uploadImages, actualImageType, safeUploadPath, persistImages, removeStoredImages };
