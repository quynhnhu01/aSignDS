const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const Validator = require('class-validator').Validator;
const validator = new Validator();
async function sendMail(req, res) {
    try {
        const username = req.user.username;
        const partnerEmail = req.params.partner;
        if (!validator.isEmail(partnerEmail)) throw new Error('Email is not valid');
        const owner = await userModel.findOne({ username: username }).select('-password');
        console.log("owner", owner);
        if (!owner) throw new Error('Not found user');
        const newPartner = await userModel.findOne({ email: partnerEmail }).select('-password');
        if (!newPartner) throw new Error('Partner email is not registered');
        const sender = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            // host: 'aspmx.l.google.com',
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: sender.user,
                pass: sender.pass,
            }
        });
        const info = await transporter.sendMail({
            from: owner.email,
            to: partnerEmail,
            subject: "Invitation to new contract",
            text: `<h1>Hello ${partnerEmail}, </h1>
                <p> You are invited to join a new contract with ${owner.email}</p>
                <br />
                <p> Check it out : link http </p>
                ------------------------------------------------------------------
                <b> This email is automatically, please do not reply</b>
            `
        });
        console.log("result send mail", info);
        `result send mail {
            accepted: [ 'xuanthu404@gmail.com' ],
            rejected: [],
            envelopeTime: 916,
            messageTime: 618,
            messageSize: 626,
            response: '250 Accepted [STATUS=new MSGID=XdIe14o5dlrp4TBCXdIe21H7a1sj4A0TAAAAAZaseUEGLbsk8gFeA.CZMFA]',
            envelope: { from: '', to: [ 'xuanthu404@gmail.com' ] },
            messageId: '<7c87c3e0-ffaa-a416-9f38-b597e461226b@PXT>'
          }`
        if (info) {
            console.log("update contract");
            const updatedContract = await contractModel.findOneAndUpdate({ owner: owner.id }, { $addToSet: { partner: newPartner.id } }, { new: true })
            if (updatedContract)
                return res.json({ 'result': updatedContract, 'message': nodemailer.getTestMessageUrl(info) });
            else throw new Error('Could not updated contract');
        }
        else throw new Error('Could not send email')
    } catch (error) {
        console.log("error", error);

        res.send(error.message);
    }
}

module.exports = {
    sendMail
}