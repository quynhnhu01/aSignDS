const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
async function getAllContractForUser(userId) {
    const contracts = await contractModel
        .find({ $or: [{ owner: userId }, { partner: userId }] })
        .populate({
            path: 'partner',
            select: 'fullname email username'
        })
        .populate({
            path: 'owner',
            select: 'fullname email username'
        })
        .exec();
    return contracts;
}
async function UpdateSignatureAnnotations(userId, contractId, signature) {
    const user = await userModel.findByIdAndUpdate(userId, {
        $addToSet: {
            signatureAnnotations: { contractId, signature }
        }
    }, { new: true });
    return user ? signature : null;
}
async function getUserById(userId) {
    return await userModel.findById(userId);
}
async function getUserByOptions(options) {
    return await userModel.findOne(options);
}
async function createHash(str) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);
    return hash;
}
async function checkValidDS(username, digitalSignature) {
    try {
        const user = await userModel.findOne({ username: username });
        if (user) {
            const publicKey = new NodeRSA();
            const hashed = await crypto.createHash("sha256").update(username, "utf8").digest("base64");
            console.log("hash username before:", hashed);
            publicKey.importKey(user._doc.publicKey, "pkcs8-public-pem");
            const result = publicKey.decryptPublic(digitalSignature, "utf8");
            console.log("hash after:", result);
            console.log("is compare:", hashed === result);
            return hashed === result;
        }
        else return false;
    } catch (error) {
        console.log(error);

    }

}
const UserService = {
    getAllContractForUser, UpdateSignatureAnnotations,
    getUserById, getUserByOptions, checkValidDS,
    createHash
}
module.exports = UserService;