const mongoose = require("mongoose");
const favoriteMovieSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  backdrop_path: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  vote_average: {
    type: Number,
    required: true,
  },
  genre_ids: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("FavoriteMovie", favoriteMovieSchema);
