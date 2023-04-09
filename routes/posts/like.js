

const express = require("express");
const sha256 = require("js-sha256");
var multer = require('multer');
var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Liked post
router.post("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id

    if(post_id){
        db.query("INSERT INTO tbllikes(post_id, liker) VALUES(?,?)", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Get Liked post by id
router.get("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id

    if(post_id){
        db.query("SELECT * FROM tbllikes WHERE post_id = ? AND liker = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.length > 0){
                    res.json({success: true, liked: true})
                } else {
                    res.json({success: true, liked: false})
                }                
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})


// Unliked post
router.delete("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id

    if(post_id){
        db.query("DELETE FROM tbllikes WHERE post_id = ? AND liker = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

module.exports = router;