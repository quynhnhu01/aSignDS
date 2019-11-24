const CONSTANTS = require("../constants");
const express = require("express");
const sampleData = require("../sampleData");

const userRouter = require("./user");
const emailRouter = require("./email");
const contractRouter = require("./contract");
const verifyRouter = require("./verify");
const gridRouter = express.Router();
// Grid Page Endpoint
gridRouter.get(CONSTANTS.ENDPOINT.GRID, (req, res) => {
    res.json(sampleData.textAssets);
});

const ROUTER = {};
ROUTER.userRouter = userRouter;
ROUTER.contractRouter = contractRouter;
ROUTER.gridRouter = gridRouter;
ROUTER.emailRouter = emailRouter;
ROUTER.verifyRouter = verifyRouter;
module.exports = ROUTER;
