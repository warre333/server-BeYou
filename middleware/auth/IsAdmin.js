const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

// Check if user is admin with JWT
const isAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"]; // Token is undefined when sent a post without data

  if (!token) {
    res.send("No token was found");
  } else {
    jwt.verify(token, authConfig.JWTSECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Failed to authenticate" });
      } else {
        if (decoded.role == "admin") {
          req.userId = decoded.id;
          req.role = decoded.role;
          next();
        } else {
          res.json({ auth: false, message: "The user is not an admin." });
        }
      }
    });
  }
};

module.exports = isAdmin;
