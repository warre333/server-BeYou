
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer")
const uuidv4 = require('uuid/v4');

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const isAdmin = require("../../middleware/auth/IsAdmin")
const db = require("../../middleware/database/database.connection");
const verifyJWT = require("../../middleware/auth/CheckJWT");

const DIR = '../../uploaded_images';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {        
        console.log(req, file)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg, .jpeg and gifs format allowed!'));
        }
    }
});
// const upload2 = multer({ dest: DIR })

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
        
        db.query(sql, [username], (err, resultUser) => {
            if(err){
                res.json({success: false, message: "User was not found."})
            } else {
                const userInfo = resultUser[0]
                const sql = "SELECT * FROM tblposts WHERE user_id = ?"

                db.query(sql, [userInfo.user_id], (err, posts) => {
                    if(err){
                        res.json({success: false, message: err})
                    } else {
                        res.json({success: true, data: {userInfo, posts}})
                    }
                })
            }
        })
    } else {
        res.json({success: false, message: "No username was entered."})
    }
})

// Save new profile data
router.patch("/profile",  (req, res) => {    
    // upload.single("profileImage"),
    const username = req.body.username
    const bio = req.body.bio
    console.log(req.file)
    console.log("---------------")
    console.log(req.body)
    res.send("done")
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

// Get total followers
router.get("/followers", (req, res) => {    
    const user_id = req.query.user_id

    if(user_id){
        db.query("SELECT count(*) AS totalFollowers FROM tblfollowers WHERE user_id = ?", [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result[0].totalFollowers})
            }
        })
    } else {        
        res.json({success: false, message: "Provide an user id to get the followers from"})
    }    
})

// Get total posts
router.get("/posts", (req, res) => {    
    const user_id = req.query.user_id

    if(user_id){
        db.query("SELECT count(*) AS totalPosts FROM tblposts WHERE user_id = ?", [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result[0].totalPosts})
            }
        })
    } else {        
        res.json({success: false, message: "Provide an user id to get the posts from"})
    }    
})

// Get total likes
router.get("/likes", (req, res) => {    
    const user_id = req.query.user_id

    if(user_id){
        db.query("SELECT count(*) AS totalLikes FROM tbllikes WHERE user_id = ?", [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result[0].totalLikes})
            }
        })
    } else {        
        res.json({success: false, message: "Provide an user id to get the likes from"})
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