const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection")
const authConfig = require("../../config/auth.config")

// Check if user is authenticated
router.get("/", CheckJWT, (req,res) => {
    res.json({success: true, user_id: req.user_id, role: req.role});	    
})

module.exports = router;