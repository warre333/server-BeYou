const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

// Check if user is admin with JWT
const isInChat = (req, res, next) => {
  const token = req.headers["x-access-token"]; // Token is undefined when sent a post without data

  if (!token) {
    res.json({ auth: false, message: "No token was found" });
  } else {
    jwt.verify(token, authConfig.JWTSECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Failed to authenticate" });
      } else {        
        db.query("SELECT tblchatrooms.*, tblusers.username, tblusers.profile_image FROM tblchatrooms, tblusers, tblchatmembers Member1, tblchatmembers Member2 WHERE tblusers.user_id = Member1.user_id AND Member1.chatroom_id = tblchatrooms.chatroom_id AND tblchatrooms.chatroom_id = Member2.chatroom_id AND Member2.user_id = ? AND Member1.user_id != ? AND tblchatrooms.chatroom_id = ? GROUP BY tblchatrooms.chatroom_id", [req.user_id, req.user_id, req.query.chatroom_id], (err, result) => {
          if(result.length > 0){
            req.userId = decoded.id;
            req.role = decoded.role;
            next();
          } else {
            res.json({ auth: false, message: err });
          }
        })
      }
    });
  }
};

module.exports = isAdmin;
