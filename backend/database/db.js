/**
 * database/db.js
 * SQLite database using sql.js (pure JavaScript, no native bindings required).
 * Data is persisted by writing the database to disk on every write operation.
 *
 * sql.js API is synchronous by design, so it fits naturally with Express.
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(process.env.DB_PATH || './database/dev.db');
const dbDir = path.dirname(DB_PATH);

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

/**
 * Persist the in-memory database to disk.
 * Call this after any write operation.
 */
function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * Execute a SELECT and return all rows as objects.
 */
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Execute a SELECT and return first row or null.
 */
function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0] || null;
}

/**
 * Execute an INSERT/UPDATE/DELETE statement.
 */
function run(sql, params = []) {
  db.run(sql, params);
  persist();
}

/**
 * Execute multiple statements at once (DDL, schema init).
 */
function exec(sql) {
  db.run(sql);
  persist();
}

/**
 * Initialize database schema — idempotent.
 */
function initializeSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS questions (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      title             TEXT NOT NULL,
      description       TEXT NOT NULL,
      difficulty        TEXT NOT NULL,
      tags              TEXT NOT NULL DEFAULT '[]',
      test_cases        TEXT NOT NULL DEFAULT '[]',
      expected_solution TEXT NOT NULL DEFAULT '',
      starter_code      TEXT NOT NULL DEFAULT '',
      validator_type    TEXT NOT NULL DEFAULT 'string',
      created_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id            TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL,
      question_id   INTEGER NOT NULL,
      code          TEXT NOT NULL,
      language      TEXT NOT NULL DEFAULT 'javascript',
      status        TEXT NOT NULL,
      results       TEXT NOT NULL DEFAULT '[]',
      passed_cases  INTEGER NOT NULL DEFAULT 0,
      total_cases   INTEGER NOT NULL DEFAULT 0,
      time_taken_ms INTEGER NOT NULL DEFAULT 0,
      submitted_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS progress (
      id                TEXT PRIMARY KEY,
      user_id           TEXT NOT NULL,
      question_id       INTEGER NOT NULL,
      status            TEXT NOT NULL DEFAULT 'not_attempted',
      attempts          INTEGER NOT NULL DEFAULT 0,
      last_attempted_at TEXT,
      UNIQUE(user_id, question_id)
    );
  `);
  persist();
}

/**
 * Bootstrap: load or create the SQLite database.
 * This is synchronous — sql.js initialization is async, so we handle it at startup.
 */
let initialized = false;

async function initialize() {
  if (initialized) return;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    // Load existing database from disk
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    // Create new database
    db = new SQL.Database();
  }

  initializeSchema();
  initialized = true;
  console.log(`📦 Database ready: ${DB_PATH}`);
}

module.exports = { initialize, all, get, run, exec, persist };
