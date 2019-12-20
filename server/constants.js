const CONSTANTS = {};
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
CONSTANTS.ENDPOINT = {};

CONSTANTS.PORT = process.env.PORT || "3001";
CONSTANTS.ENDPOINT.GRID = "/grid";
CONSTANTS.SECRET_KEY = process.env.SECRET_KEY;
CONSTANTS.DEV_URI = "mongodb://localhost:27017/asignds";
CONSTANTS.PROD_URI = `mongodb+srv://${username}:${password}@${host}/asignds?retryWrites=true&w=majority`
module.exports = CONSTANTS;
