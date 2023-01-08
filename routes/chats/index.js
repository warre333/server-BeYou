
// .io server
const httpServer = require("http").createServer();
const express = require("express");

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

io.use((socket, next) => {
  const username = "test";
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});
    // socket.auth = {  };
    // db.query("SELECT * FROM tblusers WHERE user_id = ?", [req.user_id], (err, result_user) => {
    //     db.query("SELECT * FROM tblusers, tblchatrooms, tblchatroom WHERE user_id = ?", [req.query.user_id], (err, result) => {

    //     })
    // })
    // socket.connect();

httpServer.listen(4001, (err) => {
  if(err){
    throw err
  }
})

module.exports = router;