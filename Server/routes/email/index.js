/*

    Visitors / users

*/

// Get email when registered (verify email)
// Reset password


/*

    Admin

*/

//  Send customised emails to specific users (Maybe nice feature later)

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var router = express.Router()

const CheckJWT = require("../../middleware/auth/CheckJWT");

router.get("/", (req,res) => {
    res.send("Choose the right API route within the email section");	    
})

module.exports = router;