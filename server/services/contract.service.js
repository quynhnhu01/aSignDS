const contractModel = require('../models/contract.model');

async function GetAllContracts() {
    return await contractModel.find();
}
async function GetContractById(id) {
    return await contractModel.findById(id);
}
async function CreateNewContract(newContract) {
    return await contractModel.create(newContract);
}
async function UpdateContract(id, newContract) {
    return await contractModel.findByIdAndUpdate(id, newContract, { new: true });
}
async function DeleteContract(id) {
    return await contractModel.findByIdAndDelete(id);
}
const ContractService = {
    GetAllContracts, GetContractById, CreateNewContract, UpdateContract, DeleteContract
}
module.exports = ContractService;