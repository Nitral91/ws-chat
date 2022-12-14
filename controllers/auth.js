const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const User = require('../models/User');

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

        if (passwordResult) {
            const token = jwt.sign(
                {
                    email: candidate.email,
                    userId: candidate._id
                },
                keys.jwt,
                {
                    expiresIn: 60 * 60
                }
            );

            res.status(200).json({
                token: `Bearer ${token}`,
                login: candidate.login
            })
        } else {
            res.status(401).json({
                message: 'Password is incorrect'
            })
        }
    } else {
        res.status(404).json({
            message: 'Such email does not exist'
        })
    }
};

module.exports.register = async (req, res) => {
    const candidateEmail = await User.findOne({
        email: req.body.email
    });

    const candidateLogin = await User.findOne({
        login: req.body.login
    });

    if (candidateEmail) {
        res.status(409).json({
            message: 'The user with the email already exists'
        })
    } else if (candidateLogin) {
        res.status(409).json({
            message: 'The user with such login already exists'
        })
    } else {

        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;

        const user = new User({
            login: req.body.login,
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user)
        } catch (e) {
            res.status(400).json({
                error: e
            });
        }

    }
};
