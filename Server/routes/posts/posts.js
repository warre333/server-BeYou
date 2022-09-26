

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

// Uploading images to backend
// Define storage + filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/posts/');
      },
    filename: function(req, file, cb) {
        const time = new Date().getTime()
        cb(null, sha256(time + file.originalname) + "." + (file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase()); // This generates a hash with the timestamp and original name with the original extension
    }
})

// Define image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

// post 
//  -> Get (by id)
router.get("/", (req, res) => {
    const post_id = req.query.post_id

    if(post_id){
        const sql = "SELECT * FROM tblposts WHERE post_id = ?"

        db.query(sql, [post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json(
                    {
                        success: true, 
                        data: result[0],
                    }
                )
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

//  -> Post
router.post("/",  verifyJWT,  upload.single('postImage'), (req, res) => {
    const user_id = req.user_id
    const media_link = req.file.filename
    const caption = req.body.caption

    if(media_link){
        const sql = "INSERT INTO tblposts(user_id, media_link, caption) VALUES(?,?,?)"

        db.query(sql, [user_id, media_link, caption], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                console.log(result.insertId)
                res.json({success: true,  data: { message: "Post has been created successfully.", post_id: result.insertId}})
            }
        })
    } else {
        res.json({success: false, message: "Please provide a media to share."})
    }
})

//  -> Update (by id)
router.patch("/", verifyJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id
    const caption = req.body.caption

    if(caption){
        const sql = "SELECT count(*) as posts_found FROM tblposts WHERE user_id = ? AND post_id = ?"

        db.query(sql, [user_id, post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})                
            } else {
                if(result[0].posts_found > 0){
                    const sql = "UPDATE tblposts SET caption = ? WHERE post_id = ?"

                    db.query(sql, [caption, post_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true,  message: "Post has been updated successfully."})
                        }
                    })
                } else {
                    res.json({success: false, message: "You should be the poster of the post to edit it."})
                }                
            }
        })
    } else {
        res.json({success: false, message: "Please provide an update to share."})
    }
})

//  -> Delete (by id) 
//      => For owner of post
router.delete("/", verifyJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id

    if(post_id){
        const sql = "SELECT count(*) as posts_found FROM tblposts WHERE user_id = ? AND post_id = ?"

        db.query(sql, [user_id, post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})                
            } else {
                if(result[0].posts_found > 0){
                   const sql = "DELETE FROM tblposts WHERE post_id = ? AND user_id = ?"

                    db.query(sql, [post_id, user_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true,  message: "Post has been deleted successfully."})
                        }
                    }) 
                }                
            }
        })
    } else {
        res.json({success: false, message: "Please provide a post to delete."})
    }
})

module.exports = router;