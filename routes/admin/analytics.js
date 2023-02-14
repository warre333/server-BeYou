const express = require("express");
const isAdmin = require("../../middleware/auth/IsAdmin");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    db.query("SELECT COUNT(user_id) AS users FROM tblusers", (err, result1) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            db.query("SELECT COUNT(post_id) AS posts FROM tblposts", (err, result2) => {
                if(err){
                    res.json({success: false, message: err})
                } else {
                    db.query("SELECT COUNT(ad_id) AS advertisements FROM tbladvertisements", (err, result3) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true, data: {users: result1[0].users, posts: result2[0].posts, advertisements: result3[0].advertisements}})
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;