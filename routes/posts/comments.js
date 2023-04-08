

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

// Get All Comments
router.get("/all", CheckJWT, (req, res) => {
    const post_id = req.query.post_id
    
    if(post_id){
        db.query("SELECT comment_id, comment, post_id, tblcomments.user_id, username, profile_image FROM tblcomments, tblusers WHERE post_id = ? AND tblusers.user_id = tblcomments.user_id ORDER BY comment_id DESC LIMIT 10", [post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Comment post
router.post("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id
    const comment = req.body.comment

    if(post_id && comment){
        db.query("INSERT INTO tblcomments(post_id, user_id, comment) VALUES(?,?,?)", [post_id, user_id, comment], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, comment_id: result.insertId})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Delete comment
router.delete("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const comment_id = req.query.comment_id

    if(comment_id){
        db.query("SELECT * FROM tblcomments WHERE comment_id = ? AND user_id = ?", [comment_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.length > 0){
                    db.query("DELETE FROM tblcomments WHERE comment_id = ?", [comment_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true, message: "The comment has been deleted."})
                        }
                    })
                } else {
                    res.json({success: false, message: "The comment you tried to delete is not yours."})
                }                
            }
        })
        
    } else {
        res.json({success: false, message: "Provide a comment's id."})
    }
})

module.exports = router;