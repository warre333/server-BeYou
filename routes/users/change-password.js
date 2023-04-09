
const express = require("express");
const sha256 = require("js-sha256");
var multer = require('multer');

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");
const authConfig = require("../../config/auth.config");

// Change user's password
router.patch("/", CheckJWT, (req, res) => {
    const old_password = sha256(req.body.old_password + authConfig.SALT)
    const new_password = sha256(req.body.new_password + authConfig.SALT)
    const user_id = req.user_id

    if(old_password && new_password){
        db.query("SELECT * FROM tblusers WHERE user_id = ? AND password = ?", [user_id, old_password], (err, resultUser) => {
            if(err){
                res.json({success: false, message: err})
            } else {             
                if(resultUser.length > 0) {                       
                    db.query("UPDATE tblusers SET password = ? WHERE user_id = ?", [new_password, user_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {             
                            res.json({success: true, message: "Your password has been changed."})
                        }
                    })
                } else {
                    res.json({success: false, message: "Password was incorrect."})
                }
            }
        })
    } else {
        res.json({success: false, message: "No old and/or new password was entered."})
    }
})

module.exports = router;