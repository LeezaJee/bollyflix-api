const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport.js"); // Your local passport file

/**
 * generates a JWT JSON Web Token to be passed in the Header as verification
 * @function generateJWTToken
 * @param {Object} user
 * @returns {Object} user
 *
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

// POST login
module.exports = (router) => {
  /**
   * API request to login - when successful, create token
   * @function [POST]/login
   * @param {string} user  request from user login form
   * @returns {Object} username and token
   * @requires passport
   * **/
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token }); //returns the JWT token
      });
    })(req, res);
  });
};
