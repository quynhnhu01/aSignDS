const express = require("express");
const routerUser = express.Router();
const { userController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');

routerUser.get('/users', userController.getUser);
routerUser.post('/register', userController.register);
routerUser.post('/login', userController.login);
routerUser.get('/create-ds', checkAuth, async (req, res) => {
    const digitalSignature = await userController.generateDigitalSignature(req.user.username);
    res.json({ message: "Digital signature generated", data: digitalSignature, success: true });
});
routerUser.get('/contract/:id');
module.exports = routerUser;