const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    nameContract: String,
    owner: String,
    partner: String,
    contractUrl: String,
    createdAt: String,
    updatedAt: String,
});
const contractModel = mongoose.model("upload", contractSchema);
module.exports = contractModel;