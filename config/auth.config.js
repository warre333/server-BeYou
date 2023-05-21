module.exports = {
    SALT: "SecretToEncryptThePasswordsSafely", // Salt being used with hashing the received sensitive information
    JWTSECRET: "SecretToEncryptTheJWTSafely", // The JWT secret to encrypt the tokens
    MAX_RESET_TIME: 600000, // The maximum time that you get to reset your password with the email
}
