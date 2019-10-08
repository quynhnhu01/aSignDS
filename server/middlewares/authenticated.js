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
                req.username = decoded.username;
                next();
            }
            else res.json({ message: "UNAUTHORIZED REQUEST" });
        } catch (error) {
            res.json({...error});
        }
    }
}
module.exports = AuthMiddleware;