/**
 * models/userModel.js
 * Data-access layer for the users table.
 */

const db = require('../../database/db');

const UserModel = {
  findByEmail(email) {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  findById(id) {
    return db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
  },

  create({ id, name, email, password_hash }) {
    db.run(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, name, email, password_hash]
    );
    return this.findById(id);
  },
};

module.exports = UserModel;
