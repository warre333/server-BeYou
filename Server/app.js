const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const dbConfig = require("./config/database.config")

const app = express();
const db = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE,
});
  
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));  

// Import the routes
const auth = require("./routes/auth/index")
const email = require("./routes/email/index")
const posts = require("./routes/posts/index")
const users = require("./routes/users/index")

// Let the app use the routes with the right file
app.use("/auth", auth);
app.use("/email", email);
app.use("/posts", posts);
app.use("/users", users);


// Start server
app.listen(4000, () => {
 	console.log("API has been started on port 4000!");
})