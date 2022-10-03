const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    history: [
        {
            ref: 'messages',
            type: Schema.Types.ObjectId
        }
    ]
})

module.exports = mongoose.model('rooms', roomSchema);
