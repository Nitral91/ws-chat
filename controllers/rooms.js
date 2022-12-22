const Room = require('../models/Room');

module.exports.createRoom = async (req, res) => {
    const candidateRoom = await Room.findOne({
        title: req.body.title
    })

    if (candidateRoom) {
        res.status(409).json({
            message: 'Room with the same title already exists'
        })
    } else {
        const room = new Room({
            title: req.body.title
        });

        try {
            await room.save();
            res.status(201).json(room);
        } catch (e) {
            res.status(400).json({
                error: e
            })
        }
    }
}

module.exports.getRooms = async (req, res) => {
    const rooms = [];
    const dbRooms = await Room.find({});

    dbRooms.forEach(room => {
        rooms.push({
            id: room.id,
            title: room.title
        })
    })

    if (rooms) {
        res.status(200).json(rooms);
    } else {
        res.status(204).json({
            message: 'There are no rooms so far'
        })
    }
}

module.exports.getRoomById = async (roomId) => {
    return Room.findById(roomId)
}

module.exports.getRoom = async (req, res) => {

}