const CONTROLLER = {};
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
CONTROLLER.userController = userController;
CONTROLLER.uploadController = uploadController;
module.exports = CONTROLLER;