const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const NodeRSA = require('node-rsa');
const QRCode = require('qrcode');
const UserService = require('../services/user.service');
const { createHash } = require('crypto');
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
}

async function isUserRegistered(user) {
    try {
        let existedUser;
        existedUser = await userModel.findOne({ username: user.username });
        if (!existedUser)
            existedUser = await userModel.findOne({ email: user.email });
        console.log("existedUser", existedUser);

        if (existedUser) return true;
        else return false;
    } catch (error) {
        console.log("error in isUserRegistered", error);
    }
}
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
// async function createHash(str) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(str, salt);
//     return hash;
// }
async function generateKeyPair() {
    const privateKey = new NodeRSA({ b: 256 });
    const publicKey = await privateKey.generateKeyPair(512);
    console.log("is private key:", privateKey.isPrivate());
    console.log("is public key:", publicKey.isPublic());
    const privateKeyString = await privateKey.exportKey("pkcs8-private-pem");
    const publicKeyString = await publicKey.exportKey("pkcs8-public-pem");
    return { privateKeyString, publicKeyString };
}
async function generateDigitalSignature(username, privateKeyStr) {
    try {
        const privateKey = new NodeRSA();
        privateKey.importKey(privateKeyStr, "pkcs8-private-pem");
        // const hashed = await UserService.createHash(username);
        const hashed = createHash("sha256").update(username).digest("base64");
        const digitalSignature = privateKey.encryptPrivate(hashed, "base64");
        return digitalSignature;
    } catch (error) {
        console.log("Error", error);
    }
}
// async function checkValidDS(username, digitalSignature) {
//     const user = await userModel.findOne({ username: username });
//     const publicKey = new NodeRSA();
//     const hashed = await createHash(username);
//     console.log("hash username before:", hashed);
//     publicKey.importKey(user._doc.publicKey, "pkcs8-public-pem");
//     const result = publicKey.decryptPublic(digitalSignature, "utf8");
//     console.log("hash after:", result);
//     console.log("is compare:", hashed === result);
//     return hashed === result;
// }

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
        const isExisting = await isUserRegistered(userPayload);
        if (isExisting) {
            return res.json({ message: "User already registered", error: null, success: false });
        }
        else {
            const { privateKeyString, publicKeyString } = await generateKeyPair();
            const digitalSignature = await generateDigitalSignature(userPayload.username, privateKeyString);
            userPayload.password = await UserService.createHash(userPayload.password);
            userPayload.privateKey = privateKeyString;
            userPayload.publicKey = publicKeyString;
            userPayload.digitalSignature = digitalSignature;
            console.log("Digital Signature:", digitalSignature);
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
async function getDigitalSignatureStamp(req, res) {
    const user = req.user;
    const userFound = await UserService.getUserById(user.id);
    if (userFound) {
        const digitalSignature = userFound.digitalSignature || await generateDigitalSignature(user.username, userFound.privateKey);
        // const url = req.headers.host  + '/' + req.url + `${user.username}-${digitalSignature}`;
        let ds = encodeURIComponent(digitalSignature);
        const url = `${req.protocol}://${req.headers.host}/verify/digital-sign/${user.username}&${ds}`;
        console.log(url);
        const stamp = await QRCode.toDataURL(url);
        return res.json({ stamp });
    }
}
module.exports = {
    login,
    register,
    getUser,
    getAllContractForUser,
    getDigitalSignatureStamp
}