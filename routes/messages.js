const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');

router.post('/all', messagesController.getChannelMessages);

module.exports = router;