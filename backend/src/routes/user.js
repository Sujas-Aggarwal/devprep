/**
 * routes/user.js
 * User profile and progress routes.
 */

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getProfile, getProgress } = require('../controllers/userController');

router.get('/profile', authenticate, getProfile);
router.get('/progress', authenticate, getProgress);

module.exports = router;
