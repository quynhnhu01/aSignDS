const express = require("express");
const { emailController } = require("../controllers");
const { checkAuth } = require("../middlewares");
const routeEmail = express.Router();
routeEmail.get('/invite/:partner', checkAuth, emailController.sendMail);

module.exports = routeEmail;