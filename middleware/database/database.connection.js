const mysql = require("mysql");
const dbConfig = require("../../config/database.config")

const db = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    charset: 'utf8mb4'
});

module.exports = db