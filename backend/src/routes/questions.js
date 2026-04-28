/**
 * routes/questions.js
 * Question routes: list, get by ID.
 */

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { listQuestions, getQuestion } = require('../controllers/questionController');

router.get('/', authenticate, listQuestions);
router.get('/:id', authenticate, getQuestion);

module.exports = router;
