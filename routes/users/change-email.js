
const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Change user's email
router.patch("/", CheckJWT, (req, res) => {
    const new_email = req.body.new_email
    const user_id = req.user_id

    if(new_email){                  
        db.query("UPDATE tblusers SET email = ? WHERE user_id = ?", [new_email, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {             
                if(result.affectedRows > 0){
                    res.json({success: true, message: "Your Email has been changed."})
                } else {
                    res.json({success: true, message: "Your Email was not been changed."})
                }
            }
        })
    } else {
        res.json({success: false, message: "No email was entered."})
    }
})

module.exports = router;