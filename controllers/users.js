const User = require('../models/User');

module.exports.getUserByLogin = async (login) => {
    console.log('login: ', login);
    return User.findOne({
        login
    })
}