const express = require("express");
cors = require("cors");
app = express();
bodyParser = require("body-parser");
uuid = require("uuid");
mongoose = require("mongoose");
Models = require("./models.js");

//Mongoose Models
const Movies = Models.Movie;
Users = Models.User;

const { check, validationResult } = require("express-validator");

// DEV mode - connecting to local MongoDB to perform CRUD operations
//mongoose.connect("mongodb://localhost:27017/bolly-flix", {
//  useNewUrlParser: true,
// useUnifiedTopology: true,
//});

// PROUCTION mode - connecting to remote MongoDB
/**
 * Connecting to remote Mongo DB hosted on Heroku
 * @param {string} uri encoded key, retrieved from Heroku host
 * @requires mongoose
 */

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * serves static content for the app from the 'public' directory
 */
app.use(express.static("public")); //serves “documentation.html” file from the public folder

app.use(cors());

// requires passport module & import passport.js file
/**
 * Imports auth file to use authentication
 */
let auth = require("./auth.js")(app); //app argument ensures that Express is available in your “auth.js” file too
const passport = require("passport");
require("./passport.js");

/**
 * ***********************
 * ROUTING PATHS
 * ***********************
 */

// GET Welcome page
app.get("/", (req, res) => {
  res.send(
    "Welcome to BollyFlix! Your go-to address for good Bollywood movies!"
  );
});

// GET documentation.html file
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * ***********************
 * MOVIE ROUTES
 * ***********************
 */

/**
 * API request to return a list of ALL movies
 * @function [GET]/movies
 * @returns {array} an array of movie objects
 * @requires passport
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * API request to get a single movie
 * @function [GET]/movies/:Title
 * @param {string} Title
 * @returns {Object} an object of a single movie
 * @requires passport
 * */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * API request to get information about a certain genre
 * @function [GET]/genre/:Name
 * @param {string} Name
 * @returns {string} a genre description
 * @requires passport
 * */
app.get(
  "/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * API request to get information about a movie's director
 * @function [GET]/director/:Name
 * @param {string} Name
 * @returns {object} an object with details about the director
 * @requires passport
 * */
app.get(
  "/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name }).then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send("Director Not Found");
      }
    });
  }
);

/**
 * ***********************
 * USER ROUTES
 * ***********************
 */

/**
 * API request to get the details of a specifiic user
 * @function [GET]/users/:Username
 * @param {string} Username
 * @returns {Object} a User object
 * @requires passport
 * */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(500).send("User does not exist");
        } else {
          return res.status(200).json(user);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * API request to register and validate a user
 * @function [POST]/users
 * @param {Object} User data from registration form
 * @returns {Object} an object containing the Username and Token
 * @requires bcrypt encrypted in models.js
 * */
app.post(
  "/users",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * API request to update user details
 * @function [PUT]/users/:Username
 * @param {string} Username
 * @returns {Object} an object of the updated User
 * @requires bcrypt encrypted in models.js
 * @requires passport
 * */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  //Input validation
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters"
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * API request to get the favorite movies list of a user
 * @function [GET]/users/:Username/favorites
 * @param {string} Username
 * @returns {Object} an object of the favorite movie list
 * @requires passport
 */
app.get(
  "/users/:Username/favorites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (user) {
          // If a user with the corresponding username was found, return user info
          res.status(200).json(user.FavoriteMovies);
        } else {
          res.status(400).send("Could not find favorite movies for this user");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * API request to add a movie to a user's favorite movie list
 * @function [POST]/users/:Username/favorites/:MovieID
 * @param {string} Username
 * @param {string} MovieID
 * @returns {Object} an object of thee User with the updated favorite movie list
 * @requires passport
 * */
app.post(
  "/users/:Username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: {
          FavoriteMovies: req.params.MovieID,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * API request to delete a movie from a user's favorite movie list
 * @function [DELETE]/users/:Username/favorites/:MovieID
 * @param {string} Username
 * @param {string} MovieID
 * @returns {Object} an object of the updated User
 * @requires passport
 * */
app.delete(
  "/users/:Username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * API request to delete a user profile
 * @function [DELETE]/users/:Username
 * @param {string} Username
 * @returns {string} a success or error message
 * @requires passport
 * */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// allows this port to change if necessary, if nothing is found, port is set to 8080
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on Port " + port));

//app.listen(2000, () => {
// console.log("Your app is listening on port 2000");
//});
module.exports = app;
