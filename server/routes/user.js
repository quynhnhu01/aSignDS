const express = require("express");
const routerUser = express.Router();
const { userController } = require("../controllers");
const { checkAuth } = require('../middlewares/authenticated');
const multer = require("multer");

// const diskStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     // Định nghĩa nơi file upload sẽ được lưu lại
//     callback(null, "uploads");
//     //res.json({'message': 'File uploaded successfully'});
//   },
//   filename: (req, file, callback) => {
//     const filename = '${Date.now()}-AS-${file.originalname}';
//     callback(null, filename);
//   }
// });

// const upFile = multer({storage: diskStorage}).single("file");

// routerUser.post('/upload',upFile, (req, res) => {
//     // try {
//     //   res.json({ message: "success", error: success, success: true });   
//     // } catch (error) {
//     //   res.json({ message: "Error when trying to upload", error: error, success: false })
//     // }
//     res.json({ message: "success"}); 
// });

// phần comment trên để tiện debug cho t thôi, không cần quan tâm

routerUser.get('/users', (req, res) => {
    return userController.getUser(req, res);
});
routerUser.post('/register', (req, res) => {
    return userController.register(req, res);
});
routerUser.post('/login', (req, res) => {
    return userController.login(req, res);
});
routerUser.get('/create-ds', checkAuth, async (req, res) => {
    console.log(req.username);
    
    const digitalSignature = await userController.generateDigitalSignature(req.username);
    res.json({ message: "Digital signature generated", data: digitalSignature, success: true });
})
module.exports = routerUser;