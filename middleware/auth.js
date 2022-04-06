const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    try {
        const token = req.session.data.userId;
        if(!token) {
            return res.status(401).json({errormessage: "Unauthorized."});
        }
        req.user = token
        console.log(token);
        next();
    }
    catch (err) {
        res.status(401).json({errormessage: "Unauthorized."});
        console.log(err);
    }
}

module.exports = auth;