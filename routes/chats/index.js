
// .io server
const httpServer = require("http").createServer();
const express = require("express");
const socket = require("socket.io");

const CheckJWT = require("../../middleware/auth/CheckJWT");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

const { WEBSITE_URL } = require("../../config/api.config");

const io = require("socket.io")(httpServer, {
  cors: {
    origin: WEBSITE_URL,
  },
});

io.on('connection', (socket) => {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
})


    // socket.auth = {  };
    // db.query("SELECT * FROM tblusers WHERE user_id = ?", [req.user_id], (err, result_user) => {
    //     db.query("SELECT * FROM tblusers, tblchatrooms, tblchatroom WHERE user_id = ?", [req.query.user_id], (err, result) => {

    //     })
    // })
    // socket.connect();


module.exports = router;