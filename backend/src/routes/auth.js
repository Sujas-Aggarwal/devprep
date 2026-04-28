/**
 * routes/auth.js
 * Authentication routes: register, login.
 */

const router = require('express').Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
