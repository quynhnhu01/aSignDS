const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const NodeRSA = require('node-rsa');
const UserService = require('../services/user.service');

function createToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, CONSTANTS.SECRET_KEY, { 'expiresIn': '10h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(token);
        });
    })
};
/**
 * @description Check the user already existed
 * @param {String} username username need to check
 * @returns true if user exists. Otherwise false
 */
async function isUserRegistered(username) {
    try {
        let existedUser;
        existedUser = await userModel.findOne({ username: username });
        if (!existedUser)
            existedUser = await userModel.findOne({ email: email });
        if (existedUser) return true;
        else return false;
    } catch (error) {
        console.log("error in isUserRegistered", error);
    }
};
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
async function createHash(str) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);
    return hash;
}
async function generateKeyPair() {
    const privateKey = new NodeRSA({ b: 256 });
    const publicKey = await privateKey.generateKeyPair(512);
    console.log("is private key:", privateKey.isPrivate());
    console.log("is public key:", publicKey.isPublic());
    const privateKeyString = await privateKey.exportKey("pkcs8-private-pem");
    const publicKeyString = await publicKey.exportKey("pkcs8-public-pem");
    return { privateKeyString, publicKeyString };
}
async function generateDigitalSignature(username) {
    try {
        const user = await userModel.findOne({ username: username });
        const privateKey = new NodeRSA();
        privateKey.importKey(user._doc.privateKey, "pkcs8-private-pem");
        const hashed = await createHash(username);
        const digitalSignature = privateKey.encryptPrivate(hashed, "base64");
        await checkValidDS(username, digitalSignature);
        return digitalSignature;
    } catch (error) {
        return error.message;
    }
}
async function checkValidDS(username, digitalSignature) {
    const user = await userModel.findOne({ username: username });
    const publicKey = new NodeRSA();
    const hashed = await createHash(username);
    console.log("hash username before:", hashed);
    publicKey.importKey(user._doc.publicKey, "pkcs8-public-pem");
    const result = publicKey.decryptPublic(digitalSignature, "utf8");
    console.log("hash after:", result);
    console.log("is compare:", hashed == result);
    return hashed === result;
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const userLogin = await userModel.findOne({ username: username });
        if (userLogin) {
            const isMatch = await comparePassword(password, userLogin.password);
            if (!isMatch) return res.json({ message: "Password does not match", error: "Not Matched", success: false });
            const data = {
                username: username,
                id: userLogin.id
            }
            const token = await createToken(data);
            res.json({ ...userLogin._doc, token });
        }
        else res.json({ message: "Username not found", error: "Not Found", success: false });
    } catch (error) {
        res.json({ message: error.message, error: "Login failed", success: false });
    }

}
async function register(req, res) {
    try {
        const userPayload = req.body;
        const isExisting = await isUserRegistered(userPayload.username);
        if (isExisting) {
            return res.json({ message: "User already registered", error: null, success: false });
        }
        else {
            const { privateKeyString, publicKeyString } = await generateKeyPair();
            userPayload.password = await createHash(userPayload.password);
            userPayload.privateKey = privateKeyString;
            userPayload.publicKey = publicKeyString;
            const result = await userModel.create(userPayload);
            if (result) res.json({ message: "Create user success", error: null, success: true });
        }
    } catch (error) {
        res.json({ message: "Create user failed", error: error, success: false })
    }

}
async function getUser(req, res) {
    const users = await userModel.find();
    res.json({ data: users });
}
async function getAllContractForUser(req, res) {
    const userId = req.user.id;
    if (userId) {
        const contracts = await UserService.getAllContractForUser(userId);
        console.log("contracts");
        return res.json({ data: contracts })
    }
}
module.exports = {
    login: login,
    register: register,
    getUser: getUser,
    generateDigitalSignature: generateDigitalSignature,
    getAllContractForUser
}