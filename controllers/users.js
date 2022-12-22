const User = require('../models/User');

module.exports.getUserByLogin = async (login) => {
    return User.findOne({
        login
    })
};

module.exports.getUserById = async (userId) => {
    return User.findById(userId);
}