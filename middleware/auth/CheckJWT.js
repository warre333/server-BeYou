const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth.config")

// Verify JWT => Json Web Token / Cookies
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.send("No token was found")
    } else {
        jwt.verify(token, authConfig.JWTSECRET, (err, decoded) => {
            if(err){
                console.log(err)
                res.json({auth: false, message: "Failed to authenticate"});
            } else{
                req.user_id = decoded.user_id;
                req.role = decoded.role;
                next();
            }
        })
    } 
}

module.exports = verifyJWT;