const express = require('express');
const roomsController = require('../controllers/rooms');
const router = express.Router();

// localhost:3000/api/room
router.post('/room', roomsController.createRoom);
// localhost:3000/api/room/
router.get('/room', roomsController.getRoom);
// localhost:3000/api/rooms
router.get('/rooms', roomsController.getRooms);

module.exports = router;