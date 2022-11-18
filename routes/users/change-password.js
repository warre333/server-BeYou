
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var multer = require('multer');

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const isAdmin = require("../../middleware/auth/IsAdmin")
const db = require("../../middleware/database/database.connection");
const verifyJWT = require("../../middleware/auth/CheckJWT");
const authConfig = require("../../config/auth.config");

// Uploading images to backend
// Define storage + filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/profiles/');
      },
    filename: function(req, file, cb) {
        const time = new Date().getTime()
        cb(null, sha256(time + file.originalname) + "." + (file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase()); // This generates a hash with the timestamp and original name with the original extension
    }
})

// Define image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxl" || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxs"  || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxm" || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxlx") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

// Change user's password
router.patch("/", CheckJWT, (req, res) => {
    const old_password = sha256(req.body.old_password + authConfig.SALT)
    const new_password = sha256(req.body.new_password + authConfig.SALT)
    const user_id = req.user_id

    if(old_password && new_password){
        const sql = "SELECT * FROM tblusers WHERE user_id = ? AND password = ?"
        console.log(sql, user_id, old_password)
        db.query(sql, [user_id, old_password], (err, resultUser) => {
            if(err){
                res.json({success: false, message: err})
            } else {             
                if(resultUser.length > 0) {
                    // res.json({success: true, data: resultUser[0]})                    
                    const sql = "UPDATE tblusers SET password = ? WHERE user_id = ?"
                    
                    db.query(sql, [new_password, user_id], (err, result) => {
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