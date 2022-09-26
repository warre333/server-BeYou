const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection")
const authConfig = require("../../config/auth.config")

function containsWhitespace(str) {
    return /\s/.test(str);
}

// Register
router.post("/", async(req, res) => {
    const username = "@" + req.body.username.toLowerCase();
    const email = req.body.email;
    const password = sha256(req.body.password + authConfig.SALT);
  
    const sql = "INSERT INTO tblusers (username, password, email) VALUES (?,?,?)";
  
    if (!containsWhitespace(username) && password && email) {
        db.query(sql, [username, password, email], (err, result) => {
            if (err) {
                res.send(err); 
            } else {
                const sql = "SELECT * FROM tblusers WHERE email = ? and password = ?";
  
                db.query(sql, [email, password], (err, result) => {
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
                            
                            res.json({success: true, token: token});
                        } else {
                            res.json({success: false, message: "An unkown error has occurred."});
                        }
                    }
                });

            }
        });
    } else {
        res.json({success: false, message: "All the fields should be filled in."})
    }
});

module.exports = router;