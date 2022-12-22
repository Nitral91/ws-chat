const Message = require('../models/Message');
const User = require('../models/User');
const {getRoomById} = require("./rooms");
const {getUserByLogin, getUserById} = require("./users");

module.exports.saveMessage = async (message) => {

    const newMessage = new Message({
        message: message.message,
        author: message.author,
        time: Date.now(),
        room: message.room
    });

    try {
        await newMessage.save()
            .then(res => {
                console.log('res: ', res);
            });
    } catch (e) {
        console.log('error: ', e);
        return {
            error: e
        }
    }
}

module.exports.getChannelMessages = async (req, res) => {
    const _roomId = await getRoomById(req.body.params.roomId);

    const messagesList = await Message.find({
        room: _roomId
    });

    const ids = [];

    messagesList.forEach(message => {
        ids.push(message.author);
    });

    const usersList = await User.find({
        _id: {
            $in: ids
        }
    })

    const formattedMessagesList = messagesList.map(message => {

        const user = usersList.find(user => {
            return JSON.stringify(user._id) === JSON.stringify(message.author);
        });

        return {
            message: message.message,
            userName: user.login,
            date: message.time
        }
    });

    if (messagesList) {
        res.status(201).json(formattedMessagesList)
    } else {
        res.status(204).json({
            message: 'There are messages so far'
        })
    }
}