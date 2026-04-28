/**
 * controllers/questionController.js
 * Handles listing and fetching questions.
 */

const QuestionModel = require('../models/questionModel');
const ProgressModel = require('../models/progressModel');

/**
 * GET /api/questions
 * Query params: difficulty, tag
 * Returns questions with user's progress status.
 */
function listQuestions(req, res, next) {
  try {
    const { difficulty, tag } = req.query;
    const userId = req.user.id;

    const questions = QuestionModel.findAll({ difficulty, tag });

    // Attach user progress status to each question
    const progressRows = ProgressModel.findByUser(userId);
    const progressMap = {};
    progressRows.forEach((p) => {
      progressMap[p.question_id] = p.status;
    });

    const enriched = questions.map((q) => ({
      ...q,
      user_status: progressMap[q.id] || 'not_attempted',
    }));

    const tags = QuestionModel.getAllTags();

    return res.json({ questions: enriched, tags });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/questions/:id
 * Returns a single question (without expected_solution).
 */
function getQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const question = QuestionModel.findById(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    return res.json({ question });
  } catch (err) {
    next(err);
  }
}

module.exports = { listQuestions, getQuestion };
