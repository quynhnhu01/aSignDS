const verifyModel = require('../models/verify.model');
const contractModel = require('../models/contract.model');
const UserService = require('../services/user.service');
async function verifyInvitation(req, res) {
    try {
        const code = req.params.code;
        const verification = await verifyModel.findOne({ code: code });
        if (!verification) throw new Error('Code provided is invalid');
        if (verification.partner.toString() !== req.user.id) {
            throw new Error('You are not allowed to access this contract');
        }
        // if ((new Date().getTime() - 10 * 60 * 1000) > verification.expiresIn) throw new Error('Code expired');
        else {
            const contractId = verification.contract;
            const updatedContract = await contractModel.findByIdAndUpdate(contractId, { $addToSet: { partner: req.user.id } }, { new: true });
            if (updatedContract) {
                const deleted = await verifyModel.findByIdAndDelete(verification.id);
                if (!deleted) {
                    console.log('Could not remove verify code, trying again');
                    await verifyModel.deleteOne({ id: verification.id });
                }
                return res.json({ message: 'Accepted', success: true, error: null });
            }
            else {
                console.log("Could not update contract");
                throw new Error('Failed, could not accept invitation');
            }
        }
    } catch (error) {
        return res.json({ message: error.message, error: error.name, success: false });
    }
}
async function verifyDigitalSign(req, res) {
    try {
        const username = req.params.username;
        const digitalSignature = req.params.digitalsign;
        console.log("digitalSignature", digitalSignature);
        let ds = decodeURIComponent(digitalSignature);
        const isValid = await UserService.checkValidDS(username, ds);
        console.log("is valid", isValid);

        if (isValid) return res.send("Congrats! This document has been signed by " + username);
        else return res.send("This document has not been signed, please contact your partner");
    } catch (error) {

    }
}
const verifyController = { verifyInvitation, verifyDigitalSign };
module.exports = verifyController;