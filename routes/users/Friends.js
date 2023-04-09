
const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Get all friends from the user that's logged in
router.get("/", CheckJWT, (req, res) => {
    if(req.user_id) {
        const user_id = req.user_id

        db.query("SELECT tblusers.*, T1.* FROM tblfollowers T1, tblfollowers T2, tblusers WHERE T1.user_id = T2.follower AND T1.follower = T2.user_id AND T1.user_id = ? AND tblusers.user_id = T1.follower;", [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {                
                res.json({success: true, data: result})
            }
        })
    } else {
        res.json({success: false, message: "You should be logged in or you should provide an user_id."})
    }
})

// Is following
router.get("/is-following", CheckJWT, (req, res) => {
    const user_id = req.query.user_id
    const my_user_id = req.user_id

    if(user_id){
        db.query("SELECT * FROM tblfollowers WHERE user_id = ? AND follower = ?", [user_id, my_user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {                
                if(result.length > 0){
                    res.json({success: true, is_following: true})
                } else {
                    res.json({success: true, is_following: false})
                }
            }
        })
    } else {
        res.json({success: false, message: "You should provide an user_id."})
    }
})

// Follow an user
router.post("/", CheckJWT, (req, res) => {
    const user_to_follow = req.body.user_id
    const follower = req.user_id

    if(user_to_follow){
        db.query("SELECT * FROM tblfollowers WHERE user_id = ? AND follower = ?", [user_to_follow, follower], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.length > 0){
                    res.json({success: false, message: "You're already following this user."})
                } else {
                    db.query("INSERT INTO tblfollowers(user_id, follower) VALUES(?,?)", [user_to_follow, follower], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true, message: "You're now following this user."})
                        }
                    })
                }
            }
        })
    } else {
        res.json({success: false, message: "You should be logged in or you should provide an user_id."})
    }
})

// Unfollow an user
router.delete("/", CheckJWT, (req, res) => {
    const user_to_follow = req.query.user_id
    const follower = req.user_id

    if(user_to_follow){
        db.query("DELETE FROM tblfollowers WHERE user_id = ? AND follower = ?", [user_to_follow, follower], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.affectedRows > 0){
                    res.json({success: true, message: "You're now now following this user anymore."})
                } else {                    
                    res.json({success: false, message: "You are not following this user."})
                }
            }
        })
    } else {
        res.json({success: false, message: "You should be logged in or you should provide an user_id."})
    }
})

module.exports = router;