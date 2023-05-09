
const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");


// Get user's info by ID
router.get("/", (req, res) => {
    const user_id = req.query.user_id

    if(user_id){        
        db.query("SELECT username, role, profile_image FROM tblusers WHERE user_id = ?", [user_id], (err, resultUser) => {
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
    db.query("DELETE FROM tblusers WHERE user_id = ?", [req.user_id], (err, result) => {
        if(err) {
            res.json({success: false, message: err})
        } else {
            db.query("DELETE FROM tbladvertisements WHERE (SELECT post_id FROM tblposts WHERE user_id = ?)", [req.user_id], (err, result) => {
                if(err) {
                    res.json({success: false, message: err})
                } else {
                    db.query("DELETE FROM tblposts WHERE user_id = ?", [req.user_id], (err, result) => {
                        if(err) {
                            res.json({success: false, message: err})
                        } else {
                            db.query("DELETE FROM tblchatmembers WHERE user_id = ?", [req.user_id], (err, result) => {
                                if(err) {
                                    res.json({success: false, message: err})
                                } else {
                                    db.query("DELETE FROM tblchatrooms WHERE user_id = ?", [req.user_id], (err, result) => {
                                        if(err) {
                                            res.json({success: false, message: err})
                                        } else {
                                            db.query("DELETE FROM tblcomments WHERE user_id = ?", [req.user_id], (err, result) => {
                                                if(err) {
                                                    res.json({success: false, message: err})
                                                } else {
                                                    db.query("DELETE FROM tblfollowers WHERE user_id = ? OR follower = ?", [req.user_id, req.user_id], (err, result) => {
                                                        if(err) {
                                                            res.json({success: false, message: err})
                                                        } else {
                                                            res.json({success: true, message: "The user has been deleted successfully."})
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;