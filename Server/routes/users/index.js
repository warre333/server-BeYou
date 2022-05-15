
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const isAdmin = require("../../middleware/auth/IsAdmin")
const db = require("../../middleware/database/database.connection");
const verifyJWT = require("../../middleware/auth/CheckJWT");

router.get("/", (req,res) => {
    res.send("Choose the right API route within the users section");	    
})

/*

    Visitors / users

*/

// Get profile page info from user (username, bio, profile image, total followers, total followed, posts)
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


/*

    Admin

*/

//  Review account:
//      - Update page
router.patch("/review", isAdmin, (req, res) => {
    const sql = "UPDATE tblusers SET visible = ? WHERE user_id = ?"

    db.query(sql, [req.query.visible, req.query.user], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, message: "The user has been reviewed successfully"})
        }
    })
})

//      - Delete user

//  Blacklisting (?, maybe nice feature later):
//      - Blacklist an email address



module.exports = router;