const express = require("express");
const socket = require("socket.io");
const CheckJWT = require("../../middleware/auth/CheckJWT");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.get("/", CheckJWT, (req, res) => {
    db.query("SELECT tblchatrooms.*, tblusers.username, tblusers.profile_image, tblusers.user_id, Member1.* FROM tblchatrooms, tblusers, tblchatmembers Member1, tblchatmembers Member2 WHERE tblusers.user_id = Member1.user_id AND Member1.chatroom_id = tblchatrooms.chatroom_id AND Member2.user_id = ? AND Member1.user_id != ? GROUP BY tblchatrooms.chatroom_id", [req.user_id, req.user_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, data: result})
        }
    })
})

module.exports = router;