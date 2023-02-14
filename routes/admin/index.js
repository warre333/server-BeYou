const express = require("express");
const isAdmin = require("../../middleware/auth/IsAdmin");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    res.json({success: true})
})

module.exports = router;