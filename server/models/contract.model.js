const mongoose = require('mongoose');
const contractSchema = mongoose.Schema({
    nameContract: String,
    owner: String,
    partner: String,
    contractUrl: String,
    createdAt: String,
    updatedAt: String,
    fileName: String
});
const contractModel = mongoose.model("contract", contractSchema);
module.exports = contractModel;