const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    email: String,
    uuid: String,
    dob: Date,
    publicKey: String,
    privateKey: String,
});
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;