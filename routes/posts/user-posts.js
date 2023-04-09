const express = require("express");

var router = express.Router();

const db = require("../../middleware/database/database.connection");


// Get posts from users
router.get("/", (req, res) => {
    const user_id = req.query.user_id
    const username = req.query.username

    if(user_id){
        db.query("SELECT * FROM tblposts WHERE user_id = ?", [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    } else if(username){
        db.query("SELECT user_id FROM tblusers WHERE username = ?", [username], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                const user_id = result[0].user_id

                db.query("SELECT * FROM tblposts WHERE user_id = ?", [user_id], (err, result) => {
                    if(err){
                        res.json({success: false, message: err})
                    } else {
                        res.json({success: true, data: result})
                    }
                })  
            }
        })  

        
    } else {
        res.json({success: false, message: "Provide a user id or username id."})
    }
})

module.exports = router;