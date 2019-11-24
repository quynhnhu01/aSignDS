const express = require("express");
const routeVerifier = express.Router();
const { checkAuth } = require("../middlewares");
const { verifyController } = require('../controllers');
routeVerifier.get('/invite/:code', checkAuth, verifyController.verifyInvitation);

module.exports = routeVerifier;