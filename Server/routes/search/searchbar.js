

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path")
var multer = require('multer');
var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");
const verifyJWT = require("../../middleware/auth/CheckJWT");
const isAdmin = require("../../middleware/auth/IsAdmin");
const { JWTSECRET } = require("../../config/auth.config");
const { API_URL } = require("../../config/api.config");
const { SEARCH_PAGE_SIZE } = require("../../config/search.config");

// Search
router.get("/", (req, res) => {
    const { keywords, page } = req.query

    if(page && page != null){
        db.query("SELECT tblusers.*, (SELECT COUNT(tblfollowers.user_id) FROM tblfollowers WHERE tblfollowers.user_id = tblusers.user_id) AS followers FROM tblusers WHERE username LIKE ? AND visible = 1 ORDER BY followers DESC LIMIT ? OFFSET ?", ["%" + keywords + "%", SEARCH_PAGE_SIZE, SEARCH_PAGE_SIZE * (page - 1)], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    } else {
        console.log("2");
        db.query("SELECT tblusers.*, (SELECT COUNT(tblfollowers.user_id) FROM tblfollowers WHERE tblfollowers.user_id = tblusers.user_id) AS followers FROM tblusers WHERE username LIKE ? AND visible = 1 ORDER BY followers DESC LIMIT ? OFFSET 1", ["%" + keywords + "%", SEARCH_PAGE_SIZE], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    }
})

module.exports = router;