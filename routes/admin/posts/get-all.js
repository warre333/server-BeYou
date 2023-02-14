const express = require("express");
const isAdmin = require("../../../middleware/auth/IsAdmin");
const db = require("../../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    db.query("SELECT * FROM tblposts", (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {            
            res.json({success: true, data: result})
        }
    })
})

module.exports = router;