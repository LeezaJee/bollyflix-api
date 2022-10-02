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
//mongoose.connect("mongodb://localhost:27017/BollyFlixDB", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
//});

// PROUCTION mode - connecting to remote MongoDB
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @service serves static content for the app from the 'public' directory
 */
app.use(express.static("public")); //serves “documentation.html” file from the public folder

app.use(cors());

// requires passport module & import passport.js file
let auth = require("./auth.js")(app); //app argument ensures that Express is available in your “auth.js” file too
const passport = require("passport");
require("./passport.js");

//---------------------MOVIE CODE--------------------

/**
 * @service sends a GET request to the API endpoint
 * @returns a welcome message
 */
app.get("/", (req, res) => {
  res.send(
    "Welcome to BollyFlix! Your go-to address for good Bollywood movies!"
  );
});

//---------------------setting endpoints for API--------------------

// GET all movies
/**
 * @service GET request to return a list of all movies
 * @example Request body: Bearer token needed
 * @returns an array of all movie objects
 * @param movies
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

// GET a single movie by title
/**
 * @service GET request returning data about a single movie by title (description, genre, director, image URL)
 * @example Request body: Bearer token needed
 * @returns movie object
 * @param Title (of the movie)
 * @requires passport
 */
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

// GET a movie genre by name
/**
 * @service GET request returning data about a genre (description) by movie title (e.g., "Fantasy")
 * @example Request body: Bearer token needed
 * @returns a genre object
 * @param Name (of the genre)
 * @requires passport
 */
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

// GET a director by name
/**
 * @service GET request returning data about a director by name (bio and birth year)
 * @example Request body: Bearer token needed
 * @returns a director object
 * @param Name (of director)
 * @requires passport
 */
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

//---------------------USER CODE--------------------

// GET user by username
/**
 * @service GET request returning data on a single user by username (user object)
 * @example Request body: Bearer token
 * @returns a user object
 * @param Username
 * @requires passport
 */
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

// POST a new user (registration)
/**
 * @service POST request allowing new users to register whereas Username, Password & Email are required fields!
 * @example Request body: Bearer token and JSON with user information
 * @returns a new user object
 */
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

// PUT to update user details
/**
 * @service PUT request allowing users to update their details (find by username)
 * @example Request body: Bearer token and the user info to be updated
 * @returns the updated user object
 * @param Username
 * @requires passport
 */
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

// GET favorite movies list from a user
/**
 * @service GET request returning a list of the user's favorite movies
 * @example Request body: Bearer token
 * @returns an array of a specific user's favorite movies
 * @param Username
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

// POST to add a movie to a user's favorite movies list
/**
 * @service POST request allowing users to add a movie to their list of favorite movies
 * @example Request body: Bearer token
 * @returns the user object with the updated favorite movie list
 * @param Username
 * @param MovieID
 * @requires passport
 */
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

// DELETE to remove a movie from a user's favorite movies list
/**
 * @service DELETE request allowing users to remove a movie from their favorite movies list
 * @example Request body: Bearer token
 * @returns the user object with an updated favorite movie list
 * @param Username
 * @param MovieID
 * @requires passport
 */
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

// DELETE to deregister an existing user
/**
 * @service DELETE request allowing existing users to deregister
 * @example Request body: Bearer token
 * @returns a success or error message
 * @param Username
 * @requires passport
 */
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

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

//app.listen(2000, () => {
// console.log("Your app is listening on port 2000");
//});
