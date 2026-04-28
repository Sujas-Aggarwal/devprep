/**
 * models/questionModel.js
 * Data-access layer for the questions table.
 */

const db = require('../../database/db');

function parseQuestion(q) {
  if (!q) return null;
  return {
    ...q,
    id: Number(q.id),
    tags: JSON.parse(q.tags || '[]'),
    test_cases: JSON.parse(q.test_cases || '[]'),
  };
}

const QuestionModel = {
  findAll({ difficulty, tag } = {}) {
    let query = `SELECT id, title, description, difficulty, tags, created_at FROM questions WHERE 1=1`;
    const params = [];

    if (difficulty) {
      query += ` AND difficulty = ?`;
      params.push(difficulty);
    }
    if (tag) {
      query += ` AND tags LIKE ?`;
      params.push(`%"${tag}"%`);
    }

    query += ` ORDER BY CASE difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 WHEN 'hard' THEN 3 END, id ASC`;

    return db.all(query, params).map(parseQuestion);
  },

  findById(id) {
    const q = db.get(
      `SELECT id, title, description, difficulty, tags, test_cases, starter_code, validator_type, created_at FROM questions WHERE id = ?`,
      [id]
    );
    return parseQuestion(q);
  },

  findByIdWithSolution(id) {
    const q = db.get('SELECT * FROM questions WHERE id = ?', [id]);
    return parseQuestion(q);
  },

  getAllTags() {
    const rows = db.all('SELECT tags FROM questions', []);
    const tagSet = new Set();
    rows.forEach(({ tags }) => {
      JSON.parse(tags || '[]').forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  },
};

module.exports = QuestionModel;
