

const express = require("express");
var router = express.Router();

const db = require("../../middleware/database/database.connection");
const { SEARCH_PAGE_SIZE } = require("../../config/search.config");

// Search
router.get("/", (req, res) => {
    const { keywords, page } = req.query

    db.query("SELECT tblusers.*, (SELECT COUNT(tblfollowers.user_id) FROM tblfollowers WHERE tblfollowers.user_id = tblusers.user_id) AS followers FROM tblusers WHERE username LIKE ? AND visible = 1 ORDER BY followers DESC LIMIT ? OFFSET ?", ["%" + keywords + "%", SEARCH_PAGE_SIZE, SEARCH_PAGE_SIZE * (page - 1) || 0], (err, result) => {
        if(err){
            res.json({success: false, message: err})
        } else {
            res.json({success: true, data: result})
        }
    })
})

module.exports = router;