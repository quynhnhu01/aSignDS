const multer = require('multer');
const uuid = require('uuid');
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "server/storage");
    },
    filename: (req, file, callback) => {
        if (file.mimetype === 'application/pdf') {
            callback(null, `Contract of ${req.user.username}-${uuid.v4().slice(0, 8)}.pdf`);
        }
        else callback(null, file.originalname);
    }
});

const upload = multer({ storage: diskStorage });
module.exports = { upload };