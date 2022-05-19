const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const authConfig = require("../../config/auth.config")

// Verify JWT => Json Web Token / Cookies
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]; // Token is undefined when sent a post without data
    
    if(!token) {
        res.send("No token was found")
    } else {
        jwt.verify(token, authConfig.JWTSECRET, (err, decoded) => {
            if(err){
                res.json({auth: false, message: "Failed to authenticate"});
            } else{
                req.userId = decoded.user_id;
                req.role = decoded.role;
                next();
            }
        })
    } 
}

module.exports = verifyJWT;