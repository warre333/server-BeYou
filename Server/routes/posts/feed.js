

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


// Get posts to show (feed)
router.get("/", CheckJWT, (req,res) => {
    const user_id = req.user_id

    if(user_id){
        // Explanation query: selects all posts from the people you're following and haven't seen yet
        // Add Limit
        const sql = "SELECT * FROM tblposts WHERE tblposts.user_id IN (SELECT user_id AS following FROM tblfollowers WHERE follower = ?) AND NOT EXISTS (SELECT * FROM tblviewed WHERE user_id = ? AND tblviewed.post_id = tblposts.post_id) ORDER BY RAND()"

        db.query(sql, [user_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                if(result.length > 5){ // Change to the limit that is set on receiving posts from the database
                    res.json({success: true, data: result, up_to_date: true})
                } else {
                    const sql = "SELECT * FROM tblposts WHERE tblposts.user_id IN (SELECT user_id AS following FROM tblfollowers WHERE follower = ?) ORDER BY RAND()"

                    db.query(sql, [user_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true, data: result, up_to_date: false})
                        }
                    })
                }
            }
        })   
    } else {
        res.json({success: false, message: "Log in."})
    }
})

module.exports = router;