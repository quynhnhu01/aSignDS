const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');

function createToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(username, CONSTANTS.SECRET_KEY, {}, (err, token) => {
            if (err) return reject(err);
            return resolve(token);
        });
    })
}
async function login(req, res) {
    const { username, password } = req.body;
    const userLogin = await userModel.findOne({ username: username, password: password });
    if (userLogin._id) {
        const token = await createToken(username);
        res.json({ ...userLogin, token });
    }
    else res.json({ message: "Not Found Username" });
}
async function register(req, res) {
    const userPayload = req.body;

}

module.exports = {
    login: login,
    register: register
}