
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

// Get user's info by ID
router.get("/", (req, res) => {
    const user_id = req.query.user_id

    if(user_id){
        const sql = "SELECT username, role, profile_image FROM tblusers WHERE user_id = ?"
        
        db.query(sql, [user_id], (err, resultUser) => {
            if(err){
                res.json({success: false, message: err})
            } else {             
                if(resultUser.length > 0) {
                    res.json({success: true, data: resultUser[0]})
                } else {
                    res.json({success: false, message: "User was not found."})
                }
            }
        })
    } else {
        res.json({success: false, message: "No user_id was entered."})
    }
})

// Delete user
router.delete("/", CheckJWT, (req, res) => {
    const sql = "DELETE FROM tblusers WHERE user_id = ?"

    db.query(sql, [req.user_id], (err, result) => {
        if(err) {
            res.json({success: false, message: err})
        } else {
            res.json({success: true, message: "The user has been deleted successfully."})
        }
    })
})

module.exports = router;