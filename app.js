const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const app = express();
  
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use('/images', express.static('uploads'))

// Import the routes
const auth = "./routes/auth/"
const email = "./routes/email/"
const posts = "./routes/posts/"
const users = "./routes/users/"
const search = "./routes/search/"
const chat = "./routes/chats/"

// Let the app use the routes with the right file
// Authentication
app.use("/auth/", require(auth + "index"));
app.use("/auth/login", require(auth + "login"));
app.use("/auth/register", require(auth + "register"));

// Email
// app.use("/email", email);

// Posts
app.use("/posts/", require(posts + "user-posts"));
app.use("/posts/post", require(posts + "posts"));
app.use("/posts/feed", require(posts + "feed"));
app.use("/posts/trending", require(posts + "trending"));
app.use("/posts/like", require(posts + "like"));
app.use("/posts/comment", require(posts + "comments"));
app.use("/posts/view", require(posts + "view"));

app.use("/users", require(users + "index"));
app.use("/users/likes", require(users + "likes"));
app.use("/users/profile", require(users + "profile"));
app.use("/users/password", require(users + "change-password"));
app.use("/users/email", require(users + "change-email"));
app.use("/users/friends", require(users + "friends"));


app.use("/search", require(search + "searchbar"));


app.use("/chat", require(chat + "create"));
app.use("/chat", require(chat + "index"));
app.use("/chat/all", require(chat + "get-chats"));
// app.use("/chat", require(chat + "create"));

// Algorithms
const trending_algorithm = require("./services/trending_algorithm/index");




// Start server
app.listen(4000, '10.43.36.26', () => {
 	console.log("API has been started on port 4000!");
})