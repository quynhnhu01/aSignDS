const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants');

const AuthMiddleware = {};

AuthMiddleware.checkAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        try {
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);
            if (decoded) {
                req.user = decoded;
                next();
            }
            else return res.json({ message: "Unauthorized: Access to this resources is denied", code: 401, error: "Unauthorized Error" });
        } catch (error) {
            res.json({ ...error });
        }
    }
    else {
        return res.json({ message: "Unauthorized: Access to this resources is denied", code: 401, error: "Unauthorized Error" });
    }
}
module.exports = AuthMiddleware;