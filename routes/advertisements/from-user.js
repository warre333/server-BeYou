const express = require("express");
const db = require("../../middleware/database/database.connection");
const CheckJWT = require("../../middleware/auth/CheckJWT")

var router = express.Router();

router.get("/", CheckJWT, (req, res) => {
    db.query("SELECT AD.*, POST.media_link, (SELECT COUNT(VIEWS.post_id) FROM tblviewed VIEWS WHERE VIEWS.post_id = POST.post_id AND VIEWS.ad = AD.ad_id) AS views FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE POST.user_id = ? AND status='active' GROUP BY ad_id", [req.user_id], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            db.query("SELECT AD.*, POST.media_link, (SELECT COUNT(VIEWS.post_id) FROM tblviewed VIEWS WHERE VIEWS.post_id = POST.post_id AND VIEWS.ad = AD.ad_id) AS views FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE POST.user_id = ? AND status='ended' GROUP BY ad_id", [req.user_id], (err, result_ended) => {
                if(err){
                    res.json({success: false, message: err})
                } else {
                    res.json({
                        success: true, 
                        data: {
                            active: result, 
                            ended: result_ended
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;