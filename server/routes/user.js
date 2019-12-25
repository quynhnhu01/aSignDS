const express = require("express");
const routerUser = express.Router();
const { userController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');

routerUser.get('/users', userController.getUser);
routerUser.post('/register', userController.register);
routerUser.post('/login', userController.login);
routerUser.get('/contract', checkAuth, userController.getAllContractForUser);
routerUser.get('/ds-stamp', checkAuth, userController.getDigitalSignatureStamp);
module.exports = routerUser;