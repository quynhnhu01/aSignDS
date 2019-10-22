const contractModel = require('../models/upload.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const multer = require("multer");
// const Request = require('express/lib/request');
//const disk = multer({dest:'newContractoads/'});
/* phần của multer */
const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file newContractoad sẽ được lưu lại
    callback(null, "newContractoads");
    //res.json({'message': 'File newContractoaded successfully'});
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upFile = multer({ storage: diskStorage }).single("file");

/*------- phần của multer ------*/

async function getContract(req, res) {
  // lấy form để show hợp đồng
};

async function postContract(req, res) {
  upFile(req, res, async function (err) {
    //const newContract;
    console.log(req.file);
    
    console.log(req.file.filename);

    if (err) {
      res.status(400).send('fail saving image');
    } else {
      const newContract = {};
      newContract.nameContract = "hop dong xxx";
      newContract.owner = req.username;
      newContract.parner = "";
      newContract.createdAt = Date.now();
      newContract.updatedAt = Date.now();
      newContract.contractUrl = __dirname + req.file.filename;
      console.log(newContract);

      const result = await contractModel.create(newContract);
      if (result) return res.json({ message: "Create user success", result, error: null, success: true });
      console.log(result);

      // newContract.contractUrl = req.file.filename;
      // res.send(req.file.filename);
    }

  });
};

module.exports = {
  postContract: postContract,
}