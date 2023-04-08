const express = require("express");
const isAdmin = require("../../../middleware/auth/IsAdmin");
const db = require("../../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    db.query("SELECT P.* FROM tblposts P LEFT JOIN tblusers U ON(P.user_id = U.user_id) WHERE U.username = ?", ["@" + req.query.username], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {            
            res.json({success: true, data: result})
        }
    })
})

module.exports = router;