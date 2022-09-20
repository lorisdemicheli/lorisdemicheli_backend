const jwt = require('jsonwebtoken');

module.exports.checkAuthorization = function (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                res.status(403).json({
                    error: "Operation not permitted",
                    status: 403
                });
            } else {
                req.auth = authData;
                req.token = bearerToken;
                next();
            }
        });
    } else {
        res.status(403).json({
            error: "Operation not permitted",
            status: 403
        });
    }
}