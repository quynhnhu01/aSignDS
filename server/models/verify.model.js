const mongoose = require('mongoose');

const verifySchema = mongoose.Schema({
    code: Number,
    partner: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    contract: String,
    expiresIn: { type: Number, default: new Date().getTime() }
});
const verifyModel = mongoose.model("verify", verifySchema);
module.exports = verifyModel;