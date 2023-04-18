const express = require("express");
const jwt = require("jsonwebtoken");

var router = express.Router();

const db = require("../../middleware/database/database.connection");
const { JWTSECRET } = require("../../config/auth.config");

// Get posts to show (trending)
router.get("/", (req, res) => {
  const token = req.headers["x-access-token"];
  let user_id = "";

  if (token) {
    jwt.verify(token, JWTSECRET, (err, decoded) => {
      if (decoded) {
        user_id = decoded.user_id;
      }
    });
  }

  if (user_id !== "") {
    // Explanation query: select all posts where post_id's are the same and where the user_id is not found (= not seen)
    const pageSize = 5;

    db.query(
      "SELECT P.*, (SELECT COUNT(V.post_id) FROM tblviewed V WHERE V.post_id = P.post_id) AS views, (SELECT COUNT(L.post_id) FROM tbllikes L WHERE L.post_id = P.post_id) AS likes FROM tblposts P WHERE NOT EXISTS (SELECT * FROM tblviewed V WHERE V.user_id = ? AND V.post_id = P.post_id) ORDER BY P.ranking DESC LIMIT ?",
      [user_id, pageSize],
      (err, result) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (result.length > 0) {
            // There are possible more posts available
            db.query(
              "SELECT AD.ad_id, POST.* FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE status='active' GROUP BY ad_id ORDER BY RAND()",
              (err, result_ads) => {
                if (err) {
                  res.json({ success: false, message: err });
                } else {
                  let posts = result,
                    pos = 4,
                    interval = 5,
                    ad = 0;

                  while (pos < posts.length && result_ads.length > 0) {
                    if (ad === result_ads.length) {
                      ad = 0;
                    }

                    posts.splice(pos, 0, result_ads[ad]);
                    pos += interval;
                    ad++;
                  }

                  res.json({ success: true, data: posts, up_to_date: false });
                }
              }
            );
          } else {
            //  No new posts available, repeat on random
            db.query(
              "SELECT P.*, (SELECT COUNT(V.post_id) FROM tblviewed V WHERE V.post_id = P.post_id) AS views, (SELECT COUNT(L.post_id) FROM tbllikes L WHERE L.post_id = P.post_id) AS likes FROM tblposts P ORDER BY RAND() LIMIT ?",
              [pageSize],
              (err, result) => {
                if (err) {
                  res.json({ success: false, message: err });
                } else {
                  db.query(
                    "SELECT AD.ad_id, POST.* FROM tbladvertisements AD LEFT JOIN tblposts POST ON(AD.post_id = POST.post_id) LEFT JOIN tblviewed VIEWS ON (POST.post_id = VIEWS.post_id) WHERE status='active' GROUP BY ad_id ORDER BY RAND()",
                    (err, result_ads) => {
                      if (err) {
                        res.json({ success: false, message: err });
                      } else {
                        let posts = result,
                          pos = 4,
                          interval = 5,
                          ad = 0;

                        while (pos < posts.length && result_ads.length > 0) {
                          if (ad === result_ads.length) {
                            ad = 0;
                          }
                          console.log(result_ads, result_ads[ad]);

                          posts.splice(pos, 0, result_ads[ad]);
                          pos += interval;
                          ad++;
                        }

                        res.json({
                          success: true,
                          data: posts,
                          up_to_date: true,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  } else {
    // Explanation query: select all posts with the highest rankings, not saving if viewed because user is not logged in YET
    // Add Limit
    db.query(
      "SELECT * FROM tblposts ORDER BY ranking DESC",
      [user_id],
      (err, result) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          // result[placeinarray].post_id
          res.json({ success: true, data: result });
        }
      }
    );
  }
});

module.exports = router;
