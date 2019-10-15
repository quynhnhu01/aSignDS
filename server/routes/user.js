const express = require("express");
const routerUser = express.Router();
const { userController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');
routerUser.get('/users', (req, res) => {
    return userController.getUser(req, res);
});
routerUser.post('/register', (req, res) => {
    return userController.register(req, res);
});
routerUser.post('/login', (req, res) => {
    return userController.login(req, res);
});
routerUser.get('/create-ds', checkAuth, async (req, res) => {
    console.log(req.username);
    
    const digitalSignature = await userController.generateDigitalSignature(req.username);
    res.json({ message: "Digital signature generated", data: digitalSignature, success: true });
})
module.exports = routerUser;