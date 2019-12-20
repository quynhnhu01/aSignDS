const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');
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
const UserService = {
    getAllContractForUser, UpdateSignatureAnnotations
}
module.exports = UserService;