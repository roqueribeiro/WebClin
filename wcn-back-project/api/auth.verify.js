const jwt = require('jsonwebtoken'),
    Errors = require('./errors.config');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Errors.Unauthorized();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        throw new Errors.Forbidden(error.message);
    }
    if (!decodedToken) {
        throw new Errors.Unauthorized();
    }
    next();
};