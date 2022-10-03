const mongoose = require('mongoose');
const keys = require('./config/keys');
const app = require('./app');

const connectURL = keys.mongoURI;

const http = require('http').createServer(app);

const SERVER_PORT = 3000;

const io = require('socket.io')(http, {
   cors: {
      origin: '*'
   }
})

let userList = new Map();

io.on('connection', (socket) => {
   let userName = socket.handshake.query.userName;

   addUser(userName, socket.id);

   socket.broadcast.emit('user-list', [...userList.keys()]); // Emitting an action to all connected clients
   socket.emit('user-list', [...userList.keys()]); // Emitting an action only to current connection

   socket.on('message', (msg) => {
      socket.broadcast.emit('message-broadcast', {
         message: msg,
         userName
      })
   })

   socket.on('disconnect', (reason) => {
      removeUser(userName, socket.id);
   });

});

function addUser(userName, id) {
  if (!userList.has(userName)) {
     userList.set(userName, new Set(id));
  } else {
     userList.get(userName).add(id);
  }
}

function removeUser(userName, id) {
   if (userList.has(userName)) {
      let userIds = userList.get(userName);
      if (!userIds.size) {
         userList.delete(userName);
      }
   }
}

mongoose.connect(connectURL)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

http.listen(SERVER_PORT, () => {
   console.log('Server is running on port:', SERVER_PORT);
});
