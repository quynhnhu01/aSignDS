const auth = require('./authenticated');
const upload = require('./upload');
module.exports = {
    ...auth,
    ...upload
}