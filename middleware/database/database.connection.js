const mysql = require("mysql");
const dbConfig = require("../../config/database.config");
require('dotenv').config()
// Database connection
const db = () => {
  if ('DEBUG' in process.env) {
    console.log("Env var is set:", process.env.DEBUG)
  } else {
    console.log("Env var IS NOT SET")
  }
}
// mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   charset: "utf8mb4",
// });

module.exports = db;
