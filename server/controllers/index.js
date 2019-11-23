const CONTROLLER = {};
const userController = require('./user.controller');
const contractController = require('./contract.controller');
const emailController = require('./email.controller');
CONTROLLER.userController = userController;
CONTROLLER.contractController = contractController;
CONTROLLER.emailController = emailController;
module.exports = CONTROLLER;