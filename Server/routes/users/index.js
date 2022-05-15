/*

    Visitors / users

*/

// Get profile page info from user (username, bio, profile image, total followers, total followed, posts)


/*

    Admin

*/

//  Review account:
//      - Update page
//      - Delete user

//  Blacklisting (?, maybe nice feature later):
//      - Blacklist an email address

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")

router.get("/", (req,res) => {
    res.send("Choose the right API route within the users section");	    
})

module.exports = router;