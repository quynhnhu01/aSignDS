const multer = require('multer');
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "server/storage");
    },
    filename: (req, file, callback) => {
        if (file.mimetype === 'application/pdf') {
            callback(null, file.originalname + '.pdf');
        }
        else callback(null, file.originalname);
    }
});

const upload = multer({ storage: diskStorage });
module.exports = { upload };