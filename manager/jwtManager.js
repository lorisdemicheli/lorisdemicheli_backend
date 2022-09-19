const jwt = require('jsonwebtoken');

module.exports.checkAuthorization = function (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                console.log(req);
                console.log(err);
                res.sendStatus(403);
            } else {
                req.auth = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}