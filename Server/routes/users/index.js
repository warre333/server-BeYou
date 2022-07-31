
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

router.get("/", (req,res) => {
    res.send("Choose the right API route within the users section");	    
})

/*

    Visitors / users

*/

// Get profile page info from user by username (username, bio, profile image, total followers, total followed, posts)
router.get("/profile", (req, res) => {
    const username = req.query.username

    if(username){
        const sql = "SELECT user_id, username, bio, profile_image, verified FROM tblusers WHERE username = ?"
        
        db.query(sql, [username], (err, user_info) => {
            if(err){
                res.json({success: false, message: "User was not found."})
            } else {
                if(user_info.length > 0){
                    const userInfo = user_info[0]
                    const sql = "SELECT * FROM tblposts WHERE user_id = ? ORDER BY post_id DESC"

                    db.query(sql, [userInfo.user_id], (err, posts) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            const sql = "SELECT count(*) AS totalFollowers FROM tblfollowers WHERE user_id = ?"

                            db.query(sql, [userInfo.user_id], (err, followers) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {
                                    const sql = "SELECT count(*) AS totalPosts FROM tblposts WHERE user_id = ?"

                                    db.query(sql, [userInfo.user_id], (err, total_posts) => {
                                        if(err){
                                            res.json({success: false, message: err})
                                        } else {                                    
                                            const sql = "SELECT count(*) AS totalLikes FROM tbllikes LEFT JOIN tblposts ON (tblposts.post_id = tbllikes.post_id)  WHERE tblposts.user_id = ?"

                                            db.query(sql, [userInfo.user_id], (err, likes) => {
                                                if(err){
                                                    res.json({success: false, message: err})
                                                } else {
                                                    res.json({success: true, data: {user_info, posts, total_followers: followers[0].totalFollowers, total_posts: total_posts[0].totalPosts, total_likes: likes[0].totalLikes}})
                                                }
                                            })
                                        }
                                    })
                                }
                            })                         
                        }
                    })
                } else {                    
                    res.json({success: false, message: "User was not found."})
                }
            }
        })
    } else {
        res.json({success: false, message: "No username was entered."})
    }
})

// Save new profile data
router.patch("/profile", CheckJWT, (req, res) => {
    const username = "@" + req.body.username
    const bio = req.body.bio
    
    if(username){
        db.query("UPDATE tblusers SET username = ?, bio = ? WHERE user_id = ?", [username, bio, req.user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.affectedRows > 0){
                    res.json({success: true, message: "The profile was updated successfully"})
                } else {
                    res.json({success: false, message: "Profile was not updated"})
                }
            }
        })
    } else {
        res.json({success: false, message: "Username should be provided."})
    }
})

// Save new profile image
router.patch("/profile-image", CheckJWT, upload.single("profileImage"),  (req, res) => {   
    if(req?.file?.filename){
        db.query("UPDATE tblusers SET profile_image = ? WHERE user_id = ?", [req.file.filename, req.user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.affectedRows > 0){                
                    res.json({success: true, message: "The profile image was updated successfully"})
                } else {                
                    res.json({success: false, message: "Profile image was not updated"})
                }
            }
        })
    } else {
        res.json({success: false, message: "An image should be uploaded"})
    }
})

// Get user's info by ID
router.get("/user", (req, res) => {
    const user_id = req.query.user_id

    if(user_id){
        const sql = "SELECT username, profile_image FROM tblusers WHERE user_id = ?"
        
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


/*

    Admin

*/

//  Review account:
//      - Update page
router.patch("/review", isAdmin, (req, res) => {
    //  visible_codes => Project_Info.txt
    const sql = "UPDATE tblusers SET visible = ?, visible_code = ? WHERE user_id = ?"

    db.query(sql, [req.query.visible, req.query.visibleCode, req.query.user], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, message: "The user has been reviewed successfully"})
        }
    })
})

//      - Delete user
router.delete("/user", isAdmin, (req, res) => {
    const sql = "DELETE FROM tblusers WHERE user_id = ?"

    db.query(sql, [user_id], (err, result) => {
        if(err) {
            res.json({success: false, message: err})
        } else {
            res.json({success: true, message: "The user has been deleted successfully."})
        }
    })
})

//  Blacklisting (?, maybe nice feature later):
//      - Blacklist an email address



module.exports = router;