const uuid = require('uuid');
const fs = require('fs');
const ContractService = require('../services/contract.service');
async function getContract(req, res) {
    if (!req.params.id) {
        const contracts = await ContractService.GetAllContracts();
        return res.json({ data: contracts });
    }
    else {
        //
        const contract = await ContractService.GetContractById(req.params.id);
        if (contract) {
            console.log("get contract by id", contract);
            try {
                if (!fs.existsSync(contract.contractUrl)) {
                    return res.json({ message: "Not found file contract" });
                }
                let file = fs.createReadStream(contract.contractUrl);
                file.on('error', err => {
                    console.log("readStream error", err);
                    // return res.json({ message: err.message })
                })
                let stat = fs.statSync(contract.contractUrl);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${contract.nameContract}.pdf`);//inline to attachment
                file.pipe(res);
            } catch (error) {
                return res.json({ message: error.message });
            }
        }
        else return res.json({ message: "Not found contract" });
    }
};

async function createContract(req, res) {
    console.log(req.file);
    if (!req.file) return res.json({ message: 'Missing file', error: 'Missing file', success: false });
    const fileURL = `${req.file.path}`;
    // if (fs.existsSync(fileURL)) return res.json({ message: 'File already exists', error: null, success: false });
    const newContract = {};
    newContract.nameContract = `contract-${uuid.v4().slice(0, 8)}`;
    newContract.owner = req.user.id;
    // newContract.partner = "";
    newContract.createdAt = Date.now();
    newContract.updatedAt = Date.now();
    newContract.contractUrl = fileURL;
    newContract.fileName = req.file.filename;
    newContract.isFinished = false;
    newContract.isLocked = false;
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

async function updateContract(req, res) {
    const id = req.params.id;
    const body = req.body;
    if (!body.nameContract && !body.partner) {
        return res.json({ message: "Invalid body", success: false, error: null })
    }
    const update = {
        partner: body.partner,
        nameContract: body.nameContract,
        updatedAt: Date.now()
    }
    Object.keys(update).forEach((key) => (update[key] == null) && delete update[key]);
    const contract = await ContractService.GetContractById(id);
    if (contract.owner.toString() !== req.user.id) {
        return res.json({ message: 'You are not have permission to modify', error: null, success: false });
    }
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