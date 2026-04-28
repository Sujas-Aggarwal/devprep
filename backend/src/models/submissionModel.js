/**
 * models/submissionModel.js
 * Data-access layer for the submissions table.
 */

const db = require('../../database/db');

function parseSubmission(s) {
  if (!s) return null;
  return {
    ...s,
    question_id: Number(s.question_id),
    passed_cases: Number(s.passed_cases),
    total_cases: Number(s.total_cases),
    time_taken_ms: Number(s.time_taken_ms),
    results: JSON.parse(s.results || '[]'),
  };
}

const SubmissionModel = {
  create({ id, user_id, question_id, code, language, status, results, passed_cases, total_cases, time_taken_ms }) {
    db.run(
      `INSERT INTO submissions (id, user_id, question_id, code, language, status, results, passed_cases, total_cases, time_taken_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, question_id, code, language, status, JSON.stringify(results), passed_cases, total_cases, time_taken_ms]
    );
    return this.findById(id);
  },

  findById(id) {
    return parseSubmission(db.get('SELECT * FROM submissions WHERE id = ?', [id]));
  },

  findByUser(user_id, limit = 50) {
    return db.all(
      `SELECT s.*, q.title AS question_title, q.difficulty
       FROM submissions s
       JOIN questions q ON s.question_id = q.id
       WHERE s.user_id = ?
       ORDER BY s.submitted_at DESC
       LIMIT ?`,
      [user_id, limit]
    ).map(parseSubmission);
  },

  findByUserAndQuestion(user_id, question_id) {
    return db.all(
      `SELECT * FROM submissions WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC`,
      [user_id, question_id]
    ).map(parseSubmission);
  },
};

module.exports = SubmissionModel;
