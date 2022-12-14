const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const messagesRoutes = require('./routes/messages');
const app = express();

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', roomsRoutes);
app.use('/api/messages', messagesRoutes);

module.exports = app;
