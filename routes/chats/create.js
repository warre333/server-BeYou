const express = require("express");
const CheckJWT = require("../../middleware/auth/CheckJWT");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.post("/", CheckJWT, (req, res) => {
    const user_id = req.user_id,
          receiver = req.body.user_id



    db.query("SELECT T2.chatroom_id FROM tblusers, tblchatmembers T1, tblchatmembers T2 WHERE tblusers.user_id = ? AND T2.user_id = ? AND T1.chatroom_id = T2.chatroom_id AND T1.user_id = tblusers.user_id", [user_id, receiver], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            if(result.length > 0){
                console.log(result);
                res.json({success: true, chatroom_id: result[0].chatroom_id})
            } else {
                db.query("INSERT INTO tblchatrooms() VALUES()", (err, result_room) => {
                    if(err){
                        res.json({success: false, message: err})
                    } else {
                        console.log(result_room);
                        if(result_room.insertId){
                            db.query("INSERT INTO tblchatmembers(chatroom_id, user_id) VALUES(?,?)", [result_room.insertId, user_id, result.insertId, receiver], (err, result) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {
                                    db.query("INSERT INTO tblchatmembers(chatroom_id, user_id) VALUES(?,?)", [result_room.insertId, receiver], (err, result) => {
                                        if(err){
                                            res.json({success: false, message: err})
                                        } else {
                                            res.json({success: true, chatroom_id: result_room.insertId})
                                        }
                                    })
                                }
                            })
                        } else {
                            res.json({success: false, message: "An error has occurred."})
                        }
                    }
                })
            }
        }
    })
})

module.exports = router;