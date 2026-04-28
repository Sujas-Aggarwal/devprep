/**
 * models/progressModel.js
 * Data-access layer for the progress table.
 */

const db = require('../../database/db');

const ProgressModel = {
  upsert({ id, user_id, question_id, status }) {
    const existing = db.get(
      'SELECT * FROM progress WHERE user_id = ? AND question_id = ?',
      [user_id, question_id]
    );

    if (existing) {
      const statusRank = { not_attempted: 0, attempted: 1, solved: 2 };
      const newStatus = statusRank[status] > statusRank[existing.status] ? status : existing.status;

      db.run(
        `UPDATE progress SET status = ?, attempts = attempts + 1, last_attempted_at = datetime('now')
         WHERE user_id = ? AND question_id = ?`,
        [newStatus, user_id, question_id]
      );
    } else {
      db.run(
        `INSERT INTO progress (id, user_id, question_id, status, attempts, last_attempted_at)
         VALUES (?, ?, ?, ?, 1, datetime('now'))`,
        [id, user_id, question_id, status]
      );
    }
  },

  findByUser(user_id) {
    return db.all(
      `SELECT p.*, q.title, q.difficulty, q.tags
       FROM progress p
       JOIN questions q ON p.question_id = q.id
       WHERE p.user_id = ?
       ORDER BY p.last_attempted_at DESC`,
      [user_id]
    ).map((row) => ({
      ...row,
      question_id: Number(row.question_id),
      attempts: Number(row.attempts),
      tags: JSON.parse(row.tags || '[]'),
    }));
  },

  getStats(user_id) {
    const totalQuestions = Number(db.get('SELECT COUNT(*) AS count FROM questions', []).count);

    const solved = Number(
      db.get("SELECT COUNT(*) AS count FROM progress WHERE user_id = ? AND status = 'solved'", [user_id]).count
    );
    const attempted = Number(
      db.get("SELECT COUNT(*) AS count FROM progress WHERE user_id = ? AND status IN ('attempted', 'solved')", [user_id]).count
    );
    const totalSubs = Number(
      db.get('SELECT COUNT(*) AS count FROM submissions WHERE user_id = ?', [user_id]).count
    );
    const acceptedSubs = Number(
      db.get("SELECT COUNT(*) AS count FROM submissions WHERE user_id = ? AND status = 'accepted'", [user_id]).count
    );

    const accuracy = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;
    const streak = calculateStreak(user_id);

    return {
      total_questions: totalQuestions,
      solved,
      attempted,
      not_attempted: totalQuestions - attempted,
      total_submissions: totalSubs,
      accepted_submissions: acceptedSubs,
      accuracy_percent: accuracy,
      streak_days: streak,
    };
  },
};

function calculateStreak(user_id) {
  const dates = db.all(
    `SELECT DISTINCT date(submitted_at) AS day FROM submissions
     WHERE user_id = ? AND status = 'accepted' ORDER BY day DESC`,
    [user_id]
  ).map((r) => r.day);

  if (!dates.length) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diff = (curr - next) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  const lastDate = new Date(dates[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffFromToday = (today - lastDate) / (1000 * 60 * 60 * 24);
  if (diffFromToday > 1) return 0;

  return streak;
}

module.exports = ProgressModel;
