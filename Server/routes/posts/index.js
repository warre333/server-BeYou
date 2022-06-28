

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
        const time = new Date().toISOString()
        cb(null, time.substring(0, time.length - 14) + file.originalname);
    }
})

// Define image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", (req,res) => {
    res.send("Choose the right API route within the posts section");	    
})

/*

    Visitors / users

*/

// Get posts to show (feed)
router.get("/feed", CheckJWT, (req,res) => {
    const user_id = req.user_id

    if(user_id){
        // Explanation query: selects all posts from the people you're following
        // Add Limit
        const sql = "SELECT * FROM tblposts WHERE tblposts.user_id IN (SELECT user_id AS following FROM tblfollowers WHERE follower = ?) AND NOT EXISTS (SELECT * FROM tblviewed WHERE user_id = ? AND tblviewed.post_id = tblposts.post_id) ORDER BY RAND()"

        db.query(sql, [user_id, user_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                res.json({success: true, data: result})
            }
        })   
    } else {
        res.json({success: false, message: "Log in."})
    }
})



// Get posts to show (trending)
router.get("/trending", (req,res) => {
    const token = req.headers["x-access-token"];
    
    if(token) {
        jwt.verify(token, JWTSECRET, (err, decoded) => {
            if(decoded){
                req.user_id = decoded.user_id;
                req.role = decoded.role;
            }
        })
    } 

    const user_id = req.user_id

    if(user_id){
        // Explanation query: select all posts where post_id's are the same and where the user_id is not found (= not seen)
        // Add Limit
        const sql = "SELECT * FROM tblposts WHERE NOT EXISTS (SELECT * FROM tblviewed WHERE user_id = ? AND tblviewed.post_id = tblposts.post_id) ORDER BY ranking DESC"

        db.query(sql, [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                res.json({success: true, data: result})
            }
        })   
    } else {
        // Explanation query: select all posts with the highest rankings, not saving if viewed because user is not logged in YET
        // Add Limit
        const sql = "SELECT * FROM tblposts ORDER BY ranking DESC"

        db.query(sql, [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                // result[placeinarray].post_id
                res.json({success: true, data: result})
            }
        })   
    }
})

// post 
//  -> Get (by id)
router.get("/post", (req, res) => {
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
router.post("/post",  verifyJWT,  upload.single('postImage'), (req, res) => {
    const user_id = req.user_id
    // const user_id = req.query.user_id
    const media_link = req.file.filename
    const caption = req.body.caption

    if(media_link){
        const sql = "INSERT INTO tblposts(user_id, media_link, caption) VALUES(?,?,?)"

        db.query(sql, [user_id, media_link, caption], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true,  message: "Post has been created successfully."})
            }
        })
    } else {
        res.json({success: false, message: "Please provide a media to share."})
    }
})

//  -> Update (by id)
router.patch("/post", /*verifyJWT,*/ (req, res) => {
    // const user_id = req.user_id
    const user_id = req.body.user_id // Change to req.user_id with JWT
    const post_id = req.body.post_id
    const caption = req.body.caption

    if(caption){
        const sql = "SELECT count(*) as posts_found FROM tblposts WHERE user_id = ? AND post_id = ?"

        db.query(sql, [user_id, post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})                
            } else {
                console.log(result)
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
//      => For owner of post & admins
router.delete("/post", /*verifyJWT,*/ (req, res) => {
    // const user_id = req.user_id
    // const role = req.role
    const user_id = req.query.user_id // Change to req.user_id with JWT
    const role = req.query.role // Change to req.role with JWT
    const post_id = req.query.post_id

    if(post_id){
        const sql = "SELECT count(*) as posts_found FROM tblposts WHERE user_id = ? AND post_id = ?"

        db.query(sql, [user_id, post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})                
            } else {
                // Check if the post is from the user it's requested by or if it's an admin
                if(result[0].posts_found > 0 || role == "admin"){
                   const sql = "DELETE FROM tblposts WHERE post_id = ?"

                    db.query(sql, [post_id], (err, result) => {
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


// Get posts from users
router.get("/posts", (req, res) => {
    const user_id = req.query.user_id
    const username = req.query.username

    if(user_id){
        const sql = "SELECT * FROM tblposts WHERE user_id = ?"

        db.query(sql, [user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    } else if(username){
        const sql = "SELECT user_id FROM tblusers WHERE username = ?"

        db.query(sql, [username], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                console.log(result)
                const user_id = result[0].user_id
                const sql = "SELECT * FROM tblposts WHERE user_id = ?"

                db.query(sql, [user_id], (err, result) => {
                    if(err){
                        res.json({success: false, message: err})
                    } else {
                        res.json({success: true, data: result})
                    }
                })  
            }
        })  

        
    } else {
        res.json({success: false, message: "Provide a user id or username id."})
    }
})

// Viewed post
router.post("/view", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id

    if(post_id){
        db.query("SELECT count(*) AS isViewed FROM tblviewed WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result[0].isViewed == 0){
                    db.query("INSERT INTO tblviewed(user_id, post_id) VALUES(?,?)", [user_id, post_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true})
                        }
                    })
                } else {
                    res.json({success: false, message: "Already viewed"})
                }
            }
        })
        
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Liked post
router.post("/like", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id

    if(post_id){
        db.query("INSERT INTO tbllikes(post_id, liker) VALUES(?,?)", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Get Liked post by id
router.get("/like", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id

    if(post_id){
        db.query("SELECT * FROM tbllikes WHERE post_id = ? AND liker = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.length > 0){
                    res.json({success: true, liked: true})
                } else {
                    res.json({success: true, liked: false})
                }                
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Unliked post
router.delete("/like", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id

    if(post_id){
        db.query("DELETE FROM tbllikes WHERE post_id = ? AND liker = ?", [post_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Get All Comments
router.get("/comments", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.query.post_id
    
    if(post_id){
        db.query("SELECT comment_id, comment, post_id, tblcomments.user_id, username, profile_image FROM tblcomments, tblusers WHERE post_id = ? AND tblusers.user_id = tblcomments.user_id ORDER BY comment_id DESC LIMIT 10", [post_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, data: result})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Comment post
router.post("/comment", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const post_id = req.body.post_id
    const comment = req.body.comment

    if(post_id && comment){
        db.query("INSERT INTO tblcomments(post_id, user_id, comment) VALUES(?,?,?)", [post_id, user_id, comment], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                res.json({success: true, comment_id: result.insertId})
            }
        })
    } else {
        res.json({success: false, message: "Provide a post id."})
    }
})

// Delete comment
router.delete("/comment", CheckJWT, (req, res) => {
    const user_id = req.user_id
    const comment_id = req.query.comment_id

    if(comment_id){
        db.query("SELECT * FROM tblcomments WHERE comment_id = ? AND user_id = ?", [comment_id, user_id], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {
                if(result.length > 0){
                    db.query("DELETE FROM tblcomments WHERE comment_id = ?", [comment_id], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            res.json({success: true, message: "The comment has been deleted."})
                        }
                    })
                } else {
                    res.json({success: false, message: "The commented you tried to delete is not yours./"})
                }                
            }
        })
        
    } else {
        res.json({success: false, message: "Provide a comment's id."})
    }
})


/*

    Admin

*/

// Review post (doesn't show in feeds until reviewed)
//  -> Update
router.patch("/review", isAdmin, (req, res) => {
    //  visible_codes => Project_Info.txt
    const sql = "UPDATE tblusers SET visible = ?, visible_code = ? WHERE user_id = ?"

    db.query(sql, [req.query.visible, req.query.visibleCode, req.query.user], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, message: "The user has been reviewed successfully"})
        }
    })
})

module.exports = router;