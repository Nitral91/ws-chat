const mongoose = require('mongoose');
const keys = require('./config/keys');
const app = require('./app');
const {saveMessage} = require("./controllers/messages");
const {getRoomById} = require("./controllers/rooms");
const {getUserById, getUserByLogin} = require("./controllers/users");

const connectURL = keys.mongoURI;

const http = require('http').createServer(app);

const SERVER_PORT = 3000;

const io = require('socket.io')(http, {
   cors: {
      origin: '*'
   }
})

let channelList = new Map();

io.on('connection', (socket) => {
   const CHANNEL_ID = socket.handshake.query.channelId;
   const USER_LOGIN = socket.handshake.query.userLogin;

   addChannel(CHANNEL_ID, USER_LOGIN);

   socket.on('join', (channelId) => {
      socket.join(channelId);

      socket.emit('user-list', getUsersFromChannel(CHANNEL_ID));
   });

   socket.on('leave', (channelId) => {
      socket.to(channelId).emit('user-list', removeUser(channelId, USER_LOGIN));
   })

   socket.on('disconnect', () => {
      socket.emit('user-delete', removeUser(CHANNEL_ID, USER_LOGIN));
   });

   socket.on('user-list', (channelId) => {
      socket.to(channelId).emit('user-list', getUsersFromChannel(channelId));
   })

   socket.on('message', async ({message, channelId}) => {
      const room = await getRoomById(channelId);
      const author = await getUserByLogin(message.userName);

      console.log('room: ', room);
      console.log('author: ', author);

      if (room && author) {
         const newMessage = {
            message: message.message,
            room: room._id,
            author: author._id
         }

         try {
            await saveMessage(newMessage);

            socket.to(channelId).emit('message-broadcast', {
               message: message.message,
               userName: USER_LOGIN
            })
         } catch (e) {
            socket.to(channelId).emit('error', {
               message: 'Something went wrong. Message was not sent'
            })
         }
      }
   });



});

function addChannel(channelId, userName) {
   if (!channelList.has(channelId)) {
      channelList.set(channelId, new Set([userName]));
   } else {
      channelList.get(channelId).add(userName);
   }
}

function getUsersFromChannel(channelId) {
   return Array.from(channelList.get(channelId));
}

function removeUser(channelId, userName) {
   channelList.get(channelId).delete(userName);
   return Array.from(channelList.get(channelId));
}

mongoose.connect(connectURL)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

http.listen(SERVER_PORT, () => {
   console.log('Server is running on port:', SERVER_PORT);
});
