const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Number,
    Death: Number,
  },
  ImagePath: String,
  Featured: Boolean,
  Actors: [String],
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

//links movie schema to its database collection
let Movie = mongoose.model("Movie", movieSchema);
//links user schema to its database collection
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
