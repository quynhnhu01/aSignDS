const nodemailer = require("nodemailer");
const express = require("express");

const routeEmail = express.Router();
routeEmail.get('/email', async function (req, res) {
    try {
        const sender = await nodemailer.createTestAccount()
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
            from: sender.user,
            to: "xuanthu404@gmail.com",
            subject: "This is a test email",
            text: "<h1>This is a test email</h1>"
        });
        res.send(nodemailer.getTestMessageUrl(info));
    } catch (error) {
        res.send(error.message);
    }

});

module.exports = routeEmail;