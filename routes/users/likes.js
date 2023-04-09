const express = require("express");
const sha256 = require("js-sha256");
var multer = require('multer');
var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Get Liked post from user
router.get("/", CheckJWT, (req, res) => {
    const user_id = req.user_id

    db.query("SELECT * FROM tbllikes WHERE liker = ?", [user_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, data: result})           
        }
    })
})

module.exports = router;