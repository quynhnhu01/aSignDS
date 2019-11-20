const express = require("express");
const routerContract = express.Router();
const { contractController } = require("../controllers");
const { checkAuth, upload } = require('../middlewares');
routerContract.get('/', contractController.getContract);
routerContract.post('/', checkAuth, upload.single("contract"), contractController.createContract);
routerContract.delete('/:id', checkAuth, contractController.deleteContract);
routerContract.put('/:id', checkAuth, contractController.updateContract);
module.exports = routerContract;