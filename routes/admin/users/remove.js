const express = require("express");
const isAdmin = require("../../../middleware/auth/IsAdmin");
const db = require("../../../middleware/database/database.connection");

var router = express.Router();


router.delete("/", isAdmin, (req, res) => {
    const { user_id } = req.query
    db.query("DELETE FROM tblusers WHERE user_id = ?", [user_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {            
            // db.query("DELETE FROM tbladvertisements WHERE user_id = ?", [user_id], (err, result) => {
            //     if(err){
            //         res.json({success: false, message: err})
            //     } else {            
                    db.query("DELETE FROM tblcomments WHERE user_id = ?", [user_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {            
                            db.query("DELETE FROM tblfollowers WHERE user_id = ?", [user_id], (err, result) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {              
                                    res.json({success: true, message: "The user has been deleted."})
                                }
                            })
                        }
                    })
            //     }
            // })
        }
    })
})

module.exports = router;