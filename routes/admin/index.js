const express = require("express");
const isAdmin = require("../../middleware/auth/IsAdmin");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    res.json({success: true, user_id: req.user_id})
})

module.exports = router;