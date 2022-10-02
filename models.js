const mongoose = require("mongoose");
bcrypt = require("bcrypt");

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
  FavoriteMovies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

/**
 * Encrypting password
 * @function hashPassword
 * @param {string} password
 * @returns {string} hashed password
 * @requires bcrypt
 * */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//links movie schema to its database collection
let Movie = mongoose.model("Movie", movieSchema);
//links user schema to its database collection
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
