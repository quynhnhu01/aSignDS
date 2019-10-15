const uploadModel = require('../models/upload.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const NodeRSA = require('node-rsa');
const multer = require("multer");
/* phần của multer */
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads");
    },
    filename: (req, file, callback) => {
      const filename = '${Date.now()}-AS-${file.originalname}';
      callback(null, filename);
    }
  });

const uploadFile = multer({storage: diskStorage}).single("file");
/*------- phần của multer ------*/

async function getContract(req, res) {
    // lấy form để show hợp đồng
};

async function postContract(req, res) {
    
    try {
        //res.json({'message': 'File uploaded successfully'});
        // const contractUpload = req.body;
        // contractUpload.createdAt = Date.now();
        // contractUpload.updatedAt = Date.now();
        // contractUpload.contractUrl = path.join('${__dirname}/uploads/${req.file.filename}');
        uploadFile((req, res) => {
            res.json({ message: "success", error: success, success: true });
        });
        
    } catch (error) {
        res.json({ message: "Error when trying to upload", error: error, success: false })
    }
};

module.exports = {
    postContract: postContract,
}