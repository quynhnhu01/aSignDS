const express = require("express");
const routerUpload = express.Router();
const { uploadController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');

routerUpload.get('/getupload', (req, res) => {
    return uploadController.getContract(req, res);
});
routerUpload.post('/postupload', (req, res) => {
    return uploadController.postContract(req, res);
    
});
module.exports = routerUpload;