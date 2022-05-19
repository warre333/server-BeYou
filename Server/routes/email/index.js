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
const db = require("../../middleware/database/database.connection")

router.get("/", (req,res) => {
    res.send("Choose the right API route within the email section");	    
})

// create reusable transporter object using gmail
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	auth: {
		user: '', // Put in ENV & KEEP SAFE -> email
		pass: '', // Put in ENV & KEEP SAFE -> password (can generate app password: https://myaccount.google.com/apppasswords)
	},
	port: 465,
	secure: true, // true for 465, false for other ports
	tls: {
		rejectUnauthorized: false // For Testing
	}
});

// Send Email Template: nodemailer
async function email(emailToSendTo, subjectEmail, htmlEmail) {
	// Is the emailToSendTo an array? (multiple people to send to)
	if(emailToSendTo.isArray){
		// send mail with transport object
		await transporter.sendMail(
			{
				from: "Warre's social media", // sender name
				to: emailToSendTo, // list of receivers
				subject: subjectEmail, // Subject line
				html: htmlEmail, // html body
			}, 
			function (err, info) {
				if(err){
					console.log(err)
				} else {
					// Action to do after it's send
					//  => e.g. put something in db
				}
			}
		);
	} else {
		// send mail with transport object
		await transporter.sendMail(
			{
				from: "Warre's social media", // sender name
				to: emailToSendTo, // list of receivers
				subject: subjectEmail, // Subject line
				html: htmlEmail, // html body
			}, 
			function (err, info) {
				if(err){
					console.log(err)
				} else {
					if(info.accepted[0] == emailToSendTo){ // Works if it's send to 1 person
						// Action to do after it's send
						//  => e.g. put something in db
					} 
				}
			}
		);
	}    
}


module.exports = router;