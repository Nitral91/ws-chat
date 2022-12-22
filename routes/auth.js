const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// localhost:3000/api/auth/login
router.post('/login', authController.login);
// localhost:3000/api/auth/register
router.post('/register', authController.register);

module.exports = router;
