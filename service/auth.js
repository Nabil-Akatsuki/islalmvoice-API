const jwt = require("jsonwebtoken");

exports.generateToken = (data) => {
    let token = jwt.sign(data,
        process.env.JWT_SECRET, {
        expiresIn: "1day"
    });
    return token
}