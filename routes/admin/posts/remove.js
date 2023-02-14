const express = require("express");
const isAdmin = require("../../../middleware/auth/IsAdmin");
const db = require("../../../middleware/database/database.connection");

var router = express.Router();


router.delete("/", isAdmin, (req, res) => {
    const { post_id } = req.query

    db.query("DELETE FROM tblposts WHERE post_id = ?", [post_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {            
            db.query("DELETE FROM tblcomments WHERE post_id = ?", [post_id], (err, result) => {
                if(err){
                    res.json({success: false, message: err})
                } else {            
                    db.query("DELETE FROM tblviewed WHERE post_id = ?", [post_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {                       
                            db.query("DELETE FROM tbllikes WHERE post_id = ?", [post_id], (err, result) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {              
                                    res.json({success: true, message: "The post has been deleted."})
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