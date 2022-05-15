/*

    Visitors / users

*/

// Get posts to show (feed)

// Get posts to show (trending)

// post 
//  -> Get (by id)
//  -> Post
//  -> Update (by id)
//  -> Delete (by id)

// Get posts from users



/*

    Admin

*/

// Review post (doesn't show in feeds until reviewed)
//  -> Update
//  -> Delete

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

router.get("/", (req,res) => {
    res.send("Choose the right API route within the posts section");	    
})

module.exports = router;