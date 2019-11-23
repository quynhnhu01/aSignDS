const mongoose = require('mongoose');
const SchemaTypes = mongoose.SchemaTypes;
const contractSchema = mongoose.Schema({
    nameContract: String,
    owner: { type: SchemaTypes.ObjectId, ref: 'users' },
    partner: [{ type: SchemaTypes.ObjectId, ref: 'users' }],
    contractUrl: String,
    createdAt: String,
    updatedAt: String,
    fileName: String,
    isFinished: Boolean,
});
const contractModel = mongoose.model("contract", contractSchema);
module.exports = contractModel;