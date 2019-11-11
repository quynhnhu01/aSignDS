const CONTROLLER = {};
const userController = require('../controllers/user.controller');
const contractController = require('./contract.controller');
CONTROLLER.userController = userController;
CONTROLLER.contractController = contractController;
module.exports = CONTROLLER;