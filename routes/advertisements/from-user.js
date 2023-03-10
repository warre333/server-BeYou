const express = require("express");
const db = require("../../middleware/database/database.connection");
const CheckJWT = require("../../middleware/auth/CheckJWT")

var router = express.Router();

router.get("/", CheckJWT, (req, res) => {
    db.query("SELECT * FROM tbladvertisements WHERE user_id = ?", [req.user_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, data: result})
        }
    })
})

module.exports = router;