const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const verifyModel = require('../models/verify.model');

const Validator = require('class-validator').Validator;
const validator = new Validator();
async function sendMail(req, res) {
    try {
        const username = req.user.username;
        const partnerEmail = req.params.partner;
        const contractId = req.params.id;
        if (!validator.isEmail(partnerEmail)) throw new Error('Email is not valid');
        const owner = await userModel.findOne({ username: username }).select('-password');
        console.log("owner", owner);
        if (!owner) throw new Error('Not found user');
        const newPartner = await userModel.findOne({ email: partnerEmail }).select('-password');
        if (!newPartner) throw new Error('Partner email is not registered');

        const contract = await contractModel.findById(contractId);
        if (contract.owner != owner._id.toString()) return res.json({ message: 'You don\'t have permission', success: false });
        if (contract.partner.find(partnerId => partnerId == newPartner.id)) return res.json({ message: 'This partner already joined', success: false });

        //create verify code 6 number
        const code = Math.floor(100000 + Math.random() * 900000);
        const sender = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            // host: 'aspmx.l.google.com',
            // host: 'smtp.ethereal.email',
            // port: 587,
            // secure: false,
            auth: {
                user: 'pxtpxt998@gmail.com',
                pass: 'Aa01678441221',
            },
            service: 'gmail',
        });
        const info = await transporter.sendMail({
            from: 'noreply@asignds.com',
            to: partnerEmail,
            subject: "Invitation to new contract",
            html: `<h1>Hello ${newPartner.username}, </h1>
                <p> You are invited to join a new contract with ${owner.username}</p>
                <p> Use this code to verify your invitation : <b> ${code} </b> </p>
                <p> Go to <a href="http://localhost:3001/verify"> this page</a> and verify your invitation</p>
                -------------------------------------------------------------------------------------------- </br>
                <b> This email is automatically, please do not reply</b>
            `
        });
        if (info.response) {
            console.log("update contract");
            const newVerifyCode = await verifyModel.create({
                code: code,
                partner: newPartner.id,
                contract: contract.id,
            });
            if (newVerifyCode) {
                console.log("Create new verify code");
                return res.json({ message: 'Invited, waiting for verification from your partner', success: true });
            }

        }
        else throw new Error('Could not send email')
    } catch (error) {
        console.log("error", error);

        res.send({ message: error.message, error: error.name, success: false });
    }
}

module.exports = {
    sendMail
}