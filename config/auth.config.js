require('dotenv').config()

module.exports = {
    SALT: process.env.SALT, // Salt being used with hashing the received sensitive information
    JWTSECRET: process.env.JWTSECRET, // The JWT secret to encrypt the tokens
    MAX_RESET_TIME: 600000, // The maximum time that you get to reset your password with the email
}
