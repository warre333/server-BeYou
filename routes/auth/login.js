const express = require("express");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");

var router = express.Router();

const db = require("../../middleware/database/database.connection")
const authConfig = require("../../config/auth.config")

// Login
router.post("/", (req, res) => {
    const username = "@" + req.body.username;
    const password = sha256(req.body.password + authConfig.SALT);
    
    if (username && password) {  
        db.query("SELECT * FROM tblusers WHERE username = ? and password = ?", [username.toLowerCase(), password], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                if (result.length > 0) {
                    const user_id = result[0].user_id
                    const role = result[0].role
                    
                    const data = { 
                        user_id, 
                        role 
                    }
                    const token = jwt.sign(data, authConfig.JWTSECRET, { expiresIn: 7200 })
                    
                    res.json({success: true, token: token, role});
                } else {
                    res.json({success: false, message: "The username or password is wrong."});
                }
            }
        });

    } else {
        res.json({success: false, message: "Enter username and password!"});
    }
});

module.exports = router;