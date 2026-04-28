/**
 * controllers/submissionController.js
 * Handles code submission and evaluation.
 */

const { v4: uuidv4 } = require('uuid');
const QuestionModel = require('../models/questionModel');
const SubmissionModel = require('../models/submissionModel');
const ProgressModel = require('../models/progressModel');
const { evaluate } = require('../services/evaluationEngine');

/**
 * POST /api/submit
 * Body: { question_id, code, language }
 */
function submitSolution(req, res, next) {
  try {
    const { question_id, code, language = 'javascript' } = req.body;
    const userId = req.user.id;

    // Validation
    if (!question_id || !code) {
      return res.status(400).json({ error: 'question_id and code are required.' });
    }
    if (typeof code !== 'string' || code.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide a valid code submission.' });
    }

    // Fetch question with solution (internal only)
    const question = QuestionModel.findByIdWithSolution(question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Run evaluation engine
    const evalResult = evaluate(question, code.trim());

    // Determine progress status
    const progressStatus = evalResult.status === 'accepted' ? 'solved' : 'attempted';

    // Store submission
    const submission = SubmissionModel.create({
      id: uuidv4(),
      user_id: userId,
      question_id,
      code,
      language,
      status: evalResult.status,
      results: evalResult.results,
      passed_cases: evalResult.passed,
      total_cases: evalResult.total,
      time_taken_ms: evalResult.time_taken_ms,
    });

    // Update progress
    ProgressModel.upsert({
      id: uuidv4(),
      user_id: userId,
      question_id,
      status: progressStatus,
    });

    return res.json({
      submission_id: submission.id,
      status: evalResult.status,
      passed: evalResult.passed,
      total: evalResult.total,
      time_taken_ms: evalResult.time_taken_ms,
      results: evalResult.results,
      error: evalResult.error || null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitSolution };
