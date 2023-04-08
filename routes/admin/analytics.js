const express = require("express");
const isAdmin = require("../../middleware/auth/IsAdmin");
const db = require("../../middleware/database/database.connection");

var router = express.Router();

router.get("/", isAdmin, (req, res) => {
    db.query("SELECT COUNT(user_id) AS users FROM tblusers", (err, result_users) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            db.query("SELECT COUNT(post_id) AS posts FROM tblposts", (err, result_posts) => {
                if(err){
                    res.json({success: false, message: err})
                } else {
                    db.query("SELECT COUNT(ad_id) AS advertisements FROM tbladvertisements WHERE status='active'", (err, result_active_ads) => {
                        if(err){
                            res.json({success: false, message: err})
                        } else {
                            db.query("SELECT COUNT(ad_id) AS advertisements FROM tbladvertisements WHERE status='ended'", (err, result_ended_ads) => {
                                if(err){
                                    res.json({success: false, message: err})
                                } else {
                                    db.query("SELECT AVG(budget) AS average_ad_spend FROM tbladvertisements WHERE status!='pending'", (err, result_average_ad_spend) => {
                                        if(err){
                                            res.json({success: false, message: err})
                                        } else {                                        
                                            db.query("SELECT AVG(budget) AS average_ad_spend FROM tbladvertisements WHERE status!='pending' AND CAST(time AS DATE) = CAST(CURRENT_TIMESTAMP AS DATE)", (err, result_average_ad_spend_today) => {
                                                if(err){
                                                    res.json({success: false, message: err})
                                                } else {                                                                              
                                                    db.query("SELECT SUM(budget) AS ad_spend FROM tbladvertisements WHERE status!='pending'", (err, result_ad_spend) => {
                                                        if(err){
                                                            res.json({success: false, message: err})
                                                        } else {
                                                            res.json({success: true, data: {users: result_users[0].users, posts: result_posts[0].posts, advertisements: result_active_ads[0].advertisements, ended_advertisements: result_ended_ads[0].advertisements, average_ad_spent: result_average_ad_spend[0].average_ad_spend, average_ad_spent_today: result_average_ad_spend_today[0].average_ad_spend, total_ad_spent: result_ad_spend[0].ad_spend}})
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;