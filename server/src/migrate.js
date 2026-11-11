require('dotenv').config();
const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');
const { config } = require('./config');
const db = require('./db');

async function migrate() {
  if (!/^[A-Za-z0-9_]+$/.test(config.database.name)) throw new Error('DB_NAME may contain only letters, numbers, and underscores.');
  const serverConnection = await mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password
  });
  try {
    await serverConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await serverConnection.end();
  }

  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema.split(/;\s*(?:\r?\n|$)/).map(statement => statement.trim()).filter(Boolean);
  const connection = await db.getConnection();
  try {
    for (const statement of statements) await connection.query(statement);
    console.log(`Database schema is ready: ${config.database.name}`);
  } finally {
    connection.release();
    await db.end();
  }
}

migrate().catch(error => {
  console.error('Unable to migrate database:', error.message);
  process.exitCode = 1;
});
