

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path")
var multer = require('multer');
var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");
const verifyJWT = require("../../middleware/auth/CheckJWT");
const isAdmin = require("../../middleware/auth/IsAdmin");
const { JWTSECRET } = require("../../config/auth.config");
const { API_URL } = require("../../config/api.config");

// Uploading images to backend
// Define storage + filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/posts/');
      },
    filename: function(req, file, cb) {
        const time = new Date().getTime()
        cb(null, sha256(time + file.originalname) + "." + (file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase()); // This generates a hash with the timestamp and original name with the original extension
    }
})

// Define image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'video/mp4') {
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


// Get posts to show (trending)
router.get("/", (req,res) => {
    const token = req.headers["x-access-token"];
    let user_id = ""
    
    if(token) {
        jwt.verify(token, JWTSECRET, (err, decoded) => {
            if(decoded){
                user_id = decoded.user_id;
            }
        })
    } 

    if(user_id != ""){
        // Explanation query: select all posts where post_id's are the same and where the user_id is not found (= not seen)
        // Add Limit
        const sql = "SELECT * FROM tblposts WHERE NOT EXISTS (SELECT * FROM tblviewed WHERE user_id = ? AND tblviewed.post_id = tblposts.post_id) ORDER BY ranking DESC"

        db.query(sql, [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                if(result.length > 5){    
                    res.json({success: true, data: result, up_to_date: false})
                } else {                    
                    const sql = "SELECT * FROM tblposts ORDER BY ranking DESC"

                    db.query(sql, [user_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            // result[placeinarray].post_id
                            res.json({success: true, data: result, up_to_date: true})
                        }
                    })   
                }
            }
        })   
    } else {
        // Explanation query: select all posts with the highest rankings, not saving if viewed because user is not logged in YET
        // Add Limit
        const sql = "SELECT * FROM tblposts ORDER BY ranking DESC"

        db.query(sql, [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                res.json({success: true, data: result})
            }
        })   
    }
})

module.exports = router;