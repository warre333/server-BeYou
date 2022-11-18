

const express = require("express");
const socket = require("socket.io");

var router = express.Router();

router.get("/", CheckJWT, (req, res) => {
    
})

module.exports = router;