const express = require("express");
const routerUpload = express.Router();
const { uploadController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');


routerUpload.get('/getupload', (req, res) => {
    return uploadController.getContract(req, res);
});
routerUpload.post('/postupload',checkAuth, (req, res) =>{// thêm hợp đồng
    
    return uploadController.postContract(req, res);
});
routerUpload.post('/deletecontract',checkAuth, (req, res) => { // xóa hợp đồng
    return uploadController.deleteContract(req, res);
});
routerUpload.post('/fixcontract', checkAuth, (req, res) => { // xóa hợp đồng
    return uploadController.fixContract(req, res);
});

module.exports = routerUpload;