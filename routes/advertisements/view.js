

const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

router.post("/", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id
    const ad_id = req.body.ad_id

    if(post_id, ad_id){
        db.query("INSERT INTO tblviewed(user_id, post_id, ad) VALUES(?,?,?)", [user_id, post_id, ad_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true})

                // Check if the ad has reached max views
                db.query("UPDATE tbladvertisements SET status='ended' WHERE ad_id=? AND (SELECT COUNT(post_id) FROM tblviewed WHERE ad=?) >= CEIL(?*(budget/100))", [ad_id, ad_id, 10]) 
            }
        })        
    } else {
        res.json({success: false, message: "Provide a post id and an ad id."})
    }
})

module.exports = router;