const express = require("express");
app = express();
morgan = require("morgan");
bodyParser = require("body-parser");
uuid = require("uuid");

app.use(bodyParser.json());
app.use(morgan("common")); //adds morgan middleware library
app.use(express.static("public")); //serves “documentation.html” file from the public folder



//---------------------MOVIE CODE--------------------

//READ - returns a plain welcome page
app.get("/", (req, res) => {
  res.send(
    "Welcome to BollyFlix! Your go-to address for good Bollywood movies!"
  );
});

//READ - returns the documentation.html file
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//READ - return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ - returns data about a single movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params; // syntax object destructuring === const title = req.params.title;
  const movie = movies.find((movie) => movie.Title === title); //find method to return movie object

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("There is no such movie.");
  }
});

//READ - returns movies by genre name
app.get("/movies/genres/:genreName", (req, res) => {
  const { genreName } = req.params; // syntax object destructuring === const title = req.params.title;
  const genreMovies = movies.filter((movie) =>
    movie.Genres.includes(genreName)
  );

  if (genreMovies) {
    res.status(200).json(genreMovies);
  } else {
    res.status(400).send("There is no such genre.");
  }
});

//READ - returns data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params; // syntax object destructuring === const title = req.params.title;
  const director = movies.find(
    //find method to return director object
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("There is no such director.");
  }
});

//READ - returns movies by actor's name
app.get("/movies/actors/:actorName", (req, res) => {
  const { actorName } = req.params;
  const movieName = movies.filter((movie) => movie.Actors.includes(actorName));

  if (movieName) {
    res.status(200).send(movieName);
  } else {
    res.status(400).send("There is no such actor.");
  }
});

//---------------------USER CODE--------------------

//READ - returns a list of all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

//CREATE - allows new user to register
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.Id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names");
  }
});

//UPDATE - allows users to update their user info (username)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.Id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("There is no such user.");
  }
});

//CREATE - allows users to add a movie to their list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.Id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been added to ${user.Name}'s array.`);
  } else {
    res.status(400).send(`${movieTitle} could not be added.`);
  }
});

//DELETE - allows users to remove a movie from their list of favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.Id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from ${user.Name}'s array.`);
  } else {
    res.status(400).send(`${movieTitle} could not be deleted.`);
  }
});

//DELETE - allows existing users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.Id == id);

  if (user) {
    users = users.filter((user) => user.Id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send(`There is no such user.`);
  }
});

//error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(2000, () => {
  console.log("Your app is listening on port 2000");
});
