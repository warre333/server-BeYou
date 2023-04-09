const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")

// Check if user is authenticated
router.get("/", CheckJWT, (req,res) => {
    res.json({success: true, user_id: req.user_id, role: req.role});	    
})

module.exports = router;