const mongoose = require('mongoose');
const User = require('./User');
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
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('messages', messageSchema);
