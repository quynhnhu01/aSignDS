const express = require("express");
const routerUpload = express.Router();
const { uploadController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');

  
routerUpload.get('/getupload', (req, res) => {
    return uploadController.getContract(req, res);
});
routerUpload.post('/postupload', checkAuth, (req, res) => {
    // console.log(req.file.size);
    // const fileSizeInMegabytes = req.files.size / 1000000.0;
    return uploadController.postContract(req, res);
});
module.exports = routerUpload;