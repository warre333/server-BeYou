
const express = require("express");
const sha256 = require("js-sha256");
var multer = require('multer');

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");

// Uploading images to backend
// Define storage + filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/profiles/');
      },
    filename: function(req, file, cb) {
        const time = new Date().getTime()
        cb(null, sha256(time + file.originalname) + "." + (file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase()); // This generates a hash with the timestamp and original name with the original extension
    }
})

// Define image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxl" || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxs"  || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxm" || file.originalname.split('.')[file.originalname.split('.').length -1] == "rbxlx") {
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

// Get profile page info from user by username (username, bio, profile image, total followers, total followed, posts)
router.get("/", (req, res) => {
    const username = req.query.username

    if(username){        
        db.query("SELECT user_id, username, bio, profile_image, verified FROM tblusers WHERE username = ?", [username], (err, user_info) => {
            if(err){
                res.json({success: false, message: "User was not found."})
            } else {
                if(user_info.length > 0){
                    const userInfo = user_info[0]

                    db.query("SELECT * FROM tblposts WHERE user_id = ? ORDER BY post_id DESC", [userInfo.user_id], (err, posts) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            db.query("SELECT count(*) AS totalFollowers FROM tblfollowers WHERE user_id = ?", [userInfo.user_id], (err, followers) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {
                                    db.query("SELECT count(*) AS totalPosts FROM tblposts WHERE user_id = ?", [userInfo.user_id], (err, total_posts) => {
                                        if(err){
                                            res.json({success: false, message: err})
                                        } else { 
                                            db.query("SELECT count(*) AS totalLikes FROM tbllikes LEFT JOIN tblposts ON (tblposts.post_id = tbllikes.post_id)  WHERE tblposts.user_id = ?", [userInfo.user_id], (err, likes) => {
                                                if(err){
                                                    res.json({success: false, message: err})
                                                } else {
                                                    res.json({success: true, data: {user_info, posts, total_followers: followers[0].totalFollowers, total_posts: total_posts[0].totalPosts, total_likes: likes[0].totalLikes}})
                                                }
                                            })
                                        }
                                    })
                                }
                            })                         
                        }
                    })
                } else {                    
                    res.json({success: false, message: "User was not found."})
                }
            }
        })
    } else {
        res.json({success: false, message: "No username was entered."})
    }
})

function containsWhitespace(str) {
    return /\s/.test(str);
}

// Save new profile data
router.patch("/", CheckJWT, (req, res) => {
    const username = "@" + req.body.username
    const bio = req.body.bio
    
    if(!containsWhitespace(username)){
        db.query("UPDATE tblusers SET username = ?, bio = ? WHERE user_id = ?", [username, bio, req.user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.affectedRows > 0){
                    res.json({success: true, data: {username: username, bio: bio}})
                } else {
                    res.json({success: false, message: "Profile was not updated"})
                }
            }
        })
    } else {
        res.json({success: false, message: "Username should be provided."})
    }
})

// Save new profile image
router.patch("/image", CheckJWT, upload.single("profileImage"),  (req, res) => {   
    if(req?.file?.filename){
        db.query("UPDATE tblusers SET profile_image = ? WHERE user_id = ?", [req.file.filename, req.user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.affectedRows > 0){       
                    res.json({success: true, data: {new_media_link: req.file.filename}})
                } else {                
                    res.json({success: false, message: "Profile image was not updated"})
                }
            }
        })
    } else {
        res.json({success: false, message: "An image should be uploaded"})
    }
})


module.exports = router;