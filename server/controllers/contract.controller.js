const contractModel = require('../models/contract.model');
const uuid = require('uuid');
const fs = require('fs');
const ContractService = require('../services/contract.service');
async function getContract(req, res) {
    const contracts = await ContractService.GetAllContracts();
    res.json({ data: contracts });
};

async function createContract(req, res) {
    console.log(req.file);
    console.log(req.file.filename);
    const fileURL = `${__dirname}\\${req.file.filename}`;
    if (fs.existsSync(fileURL)) return res.json({ message: 'File already exists', error: null, success: false });
    const newContract = {};
    // newContract.ID = "123456"; _id tự sinh ra bởi mongodb 
    newContract.nameContract = `contract-${uuid.v4().slice(0, 8)}`;
    newContract.owner = req.user.username;
    newContract.partner = "";
    newContract.createdAt = Date.now();
    newContract.updatedAt = Date.now();
    newContract.contractUrl = fileURL;
    newContract.fileName = req.file.filename;
    const result = await ContractService.CreateNewContract(newContract);
    if (result) return res.json({ data: result });
};

async function deleteContract(req, res) {
    console.log("id", req.params.id);
    const contractDelete = await ContractService.DeleteContract(req.params.id);
    console.log(contractDelete);

    if (contractDelete) {
        fs.unlink('server/storage/' + contractDelete.fileName, function (err) { // xóa file trong folder
            if (err) {
                console.log("error while deleting file", err);
                return res.json({ message: err.message, success: false, error: err.name });
            }
            return res.json({ success: true, message: "File deleted", error: null })
        });
    }
    else {
        return res.json({ success: false, message: "Not found contract file", error: null })
    }
};

async function updateContract(req, res) { // rename thanh updateContract
    // contractModel.findOne({ ID: req.idContract }, function (err, doc) {
    //     if (err) return console.log(err);
    //     doc.nameContract = "hop dong xxx";//??? 
    //     doc.parner = "";//???
    //     doc.updatedAt = Date.now();
    //     doc.contractUrl = __dirname + req.file.filename;//???
    //     doc.save(callback);
    // });
    //=> hàm này có chức năng update, nhưng update chỗ nào?
    //=> fix 
    const id = req.params.id;//lay id cua contract can update trong params
    const body = req.body;//noi dung update se o day
    if (!body.nameContract && !body.partner) {
        return res.json({ message: "Invalid body", success: false, error: null })
    }
    const update = {
        partner: body.partner,
        nameContract: body.nameContract,
        updatedAt: Date.now()
    }
    Object.keys(update).forEach((key) => (update[key] == null) && delete update[key]);
    // const updatedContract = await contractModel.findByIdAndUpdate(id, update, { new: true });//new true de return ve value moi nhat
    const updatedContract = await ContractService.UpdateContract(id, update);
    console.log(updatedContract);

    if (updatedContract) {
        return res.json(updatedContract);
    }
    else {
        return res.json({ message: 'Not found contract', success: false, error: null });
    }
};

module.exports = {
    getContract,
    createContract,
    deleteContract,
    updateContract
}