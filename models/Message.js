const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    author: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    room: {
        ref: 'rooms',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('messages', messageSchema);
