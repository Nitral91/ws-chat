const Message = require('../models/Message');
const User = require('../models/User');

module.exports.saveMessage = async (message) => {
    console.log('saveMessage message: ', message);
    const author = await User.findOne({
        login: message.userName
    })

    if (author) {
        const newMessage = new Message({
            message: message.message,
            author: author,
            time: Date.now(),
            room: message.room
        });

        try {
            await newMessage.save();
        } catch (e) {
            console.log('error: ', e);
            return {
                error: e
            }
        }
    }
}