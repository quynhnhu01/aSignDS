const contractModel = require('../models/upload.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const multer = require("multer");
const fs = require('fs');

/*--- phần của multer ---*/
const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "server/uploadContract");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upFile = multer({ storage: diskStorage }).single("file");

/*------- phần của multer ------*/

async function getContract(req, res) {
  const contracts = await contractModel.find();
  res.json({ data: contracts });
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
      newContract.ID = "123456";
      newContract.nameContract = "hop dong xxx";
      newContract.owner = req.username;
      newContract.parner = "";
      newContract.createdAt = Date.now();
      newContract.updatedAt = Date.now();
      newContract.contractUrl = __dirname + req.file.filename;
      console.log(newContract);

      const result = await contractModel.create(newContract);
      if (result) return res.json({ message: "Upload success!", result, error: null, success: true });
      console.log(result);
    }
  });
};

async function deleteContract(req, res) {
  const contractDelete = await contractModel.find({ ID: req.idContract });
  fs.unlink('server/uploadContract/' + contractDelete.contractUrl,function(err){ // xóa file trong folder
    if(err) return console.log(err);
    console.log('file deleted successfully');
  });
  const res = await contractModel.remove({ ID: req.idContract }); // xóa trong database
  return res.json(deleteCount);
};

async function fixContract(req, res) {
  contractModel.findOne({ ID: req.idContract }, function (err, doc) {
    if(err) return console.log(err);
    doc.nameContract = "hop dong xxx";
    doc.parner = "";
    doc.updatedAt = Date.now();
    doc.contractUrl = __dirname + req.file.filename;
    doc.save(callback);
  })
};

module.exports = {
  postContract: postContract,
  getContract: getContract,
  deleteContract: deleteContract,
  fixContract: fixContract,
}