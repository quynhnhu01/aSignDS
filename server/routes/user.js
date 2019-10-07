const express = require("express");
const routerUser = express.Router();
const { userController } = require("../controllers")
routerUser.get('/users', (req, res) => {
    return userController.login(req, res);
});

module.exports = routerUser;