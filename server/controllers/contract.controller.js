const uuid = require('uuid');
const fs = require('fs');
const ContractService = require('../services/contract.service');
const UserService = require('../services/user.service');
async function getContract(req, res) {
    if (!req.params.id) {
        const contracts = await ContractService.GetAllContracts();
        return res.json({ data: contracts });
    }
    else {
        //
        const contract = await ContractService.GetContractById(req.params.id);
        if (contract) {
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
    // console.log(req.file);
    const user = req.user;
    if (!req.file) return res.json({ message: 'Missing file', error: 'Missing file', success: false });
    const fileURL = `${req.file.path}`;
    // if (fs.existsSync(fileURL)) return res.json({ message: 'File already exists', error: null, success: false });
    const newContract = {};
    const annotations = req.body.annotations;
    newContract.nameContract = `Contract of ${user.username}-${uuid.v4().slice(0, 8)}`;
    newContract.owner = user.id;
    newContract.createdAt = Date.now();
    newContract.updatedAt = Date.now();
    newContract.contractUrl = fileURL;
    newContract.fileName = req.file.filename;
    newContract.isFinished = false;
    newContract.isLocked = false;
    newContract.annotations = annotations ? annotations : '';
    const createdContract = await ContractService.CreateNewContract(newContract);
    if (createdContract) return res.json({ data: createdContract });
};

async function deleteContract(req, res) {
    console.log("id", req.params.id);
    const contract = await ContractService.GetContractById(req.params.id);
    if (contract.owner.toString() !== req.user.id)
        return res.json({ success: false, message: "You don\'t have permission to delete this contract", error: null })
    const contractDeleted = await ContractService.DeleteContract(req.params.id);
    if (contractDeleted) {
        fs.unlink('server/storage/' + contractDeleted.fileName, function (err) { // xóa file trong folder
            if (err) {
                console.log("error while deleting file", err);
                return res.json({ message: err.message, success: false, error: err.name });
            }
            return res.json({ success: true, message: "Successfully delete contract", error: null, data: contractDeleted })
        });
    }
    else {
        return res.json({ success: false, message: "Not found your contract file", error: null })
    }
};

async function updateContract(req, res) {
    const id = req.params.id;
    const body = req.body;
    const update = {
        partner: body.partner,
        nameContract: body.nameContract,
        annotations: body.annotations,
        updatedAt: Date.now()
    }
    Object.keys(update).forEach((key) => (update[key] == null || update[key] == '') && delete update[key]);
    const contract = await ContractService.GetContractById(id);
    if (contract.owner.toString() !== req.user.id && (update.partner || update.nameContract)) {
        return res.json({ message: 'You are not have permission to modify', error: null, success: false });
    }
    const updatedContract = await ContractService.UpdateContract(id, update);
    console.log(updatedContract);

    if (updatedContract) {
        return res.json(updatedContract);
    }
    else {
        return res.json({ message: 'Cannot update contract', success: false, error: null });
    }
};
module.exports = {
    getContract,
    createContract,
    deleteContract,
    updateContract,
}