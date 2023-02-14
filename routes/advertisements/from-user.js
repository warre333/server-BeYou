const express = require("express");
const db = require("../../middleware/database/database.connection");
const CheckJWT = require("../../middleware/auth/CheckJWT")

var router = express.Router();

router.get("/", CheckJWT, (req, res) => {
    res.json({success: true})
})

module.exports = router;