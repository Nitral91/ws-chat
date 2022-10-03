const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// localhost:3000/ap/auth/login
router.post('/login', authController.login);
// localhost:3000/ap/auth/register
router.post('/register', authController.register);

module.exports = router;
