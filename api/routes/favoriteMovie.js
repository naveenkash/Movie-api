const router = require("express").Router();
const apiError = require("../error-handler/apiErrors");
const favoriteMovies = require("../models/favoriteMovie");
const mongoose = require("mongoose");
const authenticateUser = require("../middlewares/authenticateUser");

router.post("/update", authenticateUser, async (req, res, next) => {
  const body = req.body;
  try {
    const favMovieExist = await favoriteMovies.findOne({
      id: body.id,
      user_id: body.user_id,
    });
    if (favMovieExist) {
      next(apiError.badRequest("Movie already exist"));
      return;
    }
    const favMovie = new favoriteMovies({
      _id: mongoose.Types.ObjectId(),
      id: body.id,
      user_id: body.user_id,
      poster_path: body.poster_path,
      backdrop_path: body.backdrop_path,
      overview: body.overview,
      title: body.title,
      release_date: body.release_date,
      vote_average: body.vote_average,
      genre_ids: body.genre_ids,
    });
    const favMovieSaved = await favMovie.save();
    if (favMovieSaved) {
      res.status(201).json({
        ok: true,
      });
    } else {
      next(apiError.interServerError("Adding to favorite list failed"));
      return;
    }
  } catch (error) {
    next(apiError.interServerError(error.message));
    return;
  }
});

router.get("/all", authenticateUser, async (req, res, next) => {
  const q = req.query;
  const limit = 20,
    page = q.page,
    body = req.body;
  try {
    let favMovies = [];
    if (page) {
      favMovies = await favoriteMovies
        .find({
          user_id: body.user_id,
        })
        .limit(limit)
        .skip(limit * (page - 1));
    } else {
      favMovies = await favoriteMovies
        .find({
          user_id: body.user_id,
        })
        .limit(limit);
    }
    let allMovies = await favoriteMovies.find({
      user_id: body.user_id,
    });

    res.status(201).json({
      results: favMovies,
      total_pages: Math.ceil(allMovies.length / limit),
      page: parseInt(q.page) || 1,
    });
  } catch (error) {
    next(apiError.interServerError(error.message));
    return;
  }
});
module.exports = router;
