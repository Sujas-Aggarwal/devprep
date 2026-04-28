/**
 * routes/submissions.js
 * Submission route: submit solution.
 */

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { submitSolution } = require('../controllers/submissionController');

router.post('/', authenticate, submitSolution);

module.exports = router;
