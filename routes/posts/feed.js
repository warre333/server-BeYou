const express = require("express");

var router = express.Router();

const CheckJWT = require("../../middleware/auth/CheckJWT")
const db = require("../../middleware/database/database.connection");


// Get posts to show (feed)
router.get("/", CheckJWT, (req,res) => {
    const user_id = req.user_id

    if(user_id){
        // Explanation query: selects all posts from the people you're following and haven't seen yet
        const pageSize = 1 

        db.query("SELECT * FROM tblposts WHERE tblposts.user_id IN (SELECT user_id AS following FROM tblfollowers WHERE follower = ?) AND NOT EXISTS (SELECT * FROM tblviewed WHERE user_id = ? AND tblviewed.post_id = tblposts.post_id) ORDER BY RAND() LIMIT ?", [user_id, user_id, pageSize], (err, result) => {
            if(err){
                res.json({success: false, message: err})
            } else {                
                if(result.length > 0){   
                    db.query("SELECT AD.ad_id, POST.* FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE status='active' GROUP BY ad_id ORDER BY RAND()", (err, result_ads) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            let posts = result,
                                pos = 4,
                                interval = 5,
                                ad = 0
            
                            while (pos < posts.length) {
                                if(ad > result_ads.length){
                                    ad = 0
                                }
                                
                                posts.splice(pos, 0, result_ads[ad])
                                pos += interval
                                ad++
                            }
                            
                            if(posts.length < pos){
                                if(req.query.ad && result_ads.length > 0){
                                    posts.push(result_ads[ad])
                                    ad++
                                }
                            }
            
                            res.json({success: true, data: posts, up_to_date: true})        
                        }
                    })
                } else {
                    db.query("SELECT P.*, (SELECT COUNT(V.post_id) FROM tblviewed V WHERE V.post_id = P.post_id) AS views, (SELECT COUNT(L.post_id) FROM tbllikes L WHERE L.post_id = P.post_id) AS likes FROM tblposts P ORDER BY RAND() LIMIT ?", [pageSize], (err, result) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {                
                            db.query("SELECT AD.ad_id, POST.* FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE status='active' GROUP BY ad_id ORDER BY RAND()", (err, result_ads) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {
                                    let posts = result,
                                        pos = 4,
                                        interval = 5,
                                        ad = 0
                    
                                    while (pos < posts.length) {
                                        if(ad > result_ads.length){
                                            ad = 0
                                        } 
                                        
                                        posts.splice(pos, 0, result_ads[ad])
                                        pos += interval
                                        ad++
                                    }

                                    if(posts.length < pos){
                                        if(req.query.ad && result_ads.length > 0){
                                            posts.push(result_ads[ad])
                                            ad++
                                        }
                                    }
                    
                                    res.json({success: true, data: posts, up_to_date: true})        
                                }
                            })
                        }
                    })
                }
            }
        })   
    } else {
        res.json({success: false, message: "Log in."})
    }
})

module.exports = router;