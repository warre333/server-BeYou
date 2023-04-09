

const express = require("express");
const sha256 = require("js-sha256");
var multer = require('multer');
var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Viewed post
router.post("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id

    if(post_id){
        db.query("SELECT count(*) AS isViewed FROM tblviewed WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result[0].isViewed == 0){
                    db.query("INSERT INTO tblviewed(user_id, post_id) VALUES(?,?)", [user_id, post_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true})
                        }
                    })
                } else {
                    res.json({success: false, message: "Already viewed"})
                }
            }
        })
        
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

module.exports = router;