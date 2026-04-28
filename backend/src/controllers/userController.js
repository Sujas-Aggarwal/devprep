/**
 * controllers/userController.js
 * Handles user profile and progress endpoints.
 */

const UserModel = require('../models/userModel');
const ProgressModel = require('../models/progressModel');
const SubmissionModel = require('../models/submissionModel');

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile.
 */
function getProfile(req, res, next) {
  try {
    const user = UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/user/progress
 * Returns aggregate stats + per-question progress + recent submissions.
 */
function getProgress(req, res, next) {
  try {
    const userId = req.user.id;

    const stats = ProgressModel.getStats(userId);
    const questionProgress = ProgressModel.findByUser(userId);
    const recentSubmissions = SubmissionModel.findByUser(userId, 20);

    return res.json({
      stats,
      question_progress: questionProgress,
      recent_submissions: recentSubmissions,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, getProgress };
