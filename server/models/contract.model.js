const mongoose = require('mongoose');
const SchemaTypes = mongoose.SchemaTypes;
const contractSchema = mongoose.Schema({
    nameContract: String,
    owner: { type: SchemaTypes.ObjectId, ref: 'users' },
    partner: { type: SchemaTypes.Array },
    contractUrl: String,
    createdAt: String,
    updatedAt: String,
    fileName: String
});
const contractModel = mongoose.model("contract", contractSchema);
module.exports = contractModel;