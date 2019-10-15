const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    nameContract: String,
    owner: String,
    parner: String,
    contractUrl: String,
    createdAt: String,
    updatedAt: String,
});
const uploadModel = mongoose.model("upload", uploadSchema);
module.exports = uploadModel;