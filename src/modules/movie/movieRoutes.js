const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
//= ================================================================
const middlewareUpload = require("../../middleware/uploadMovie");
//= ===================================================================

Router.get("/", movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  // middlewareRedis.getMovieRedis,
  movieController.getMovieById
);
Router.get("/upcomming", movieController.getMovieUpcomming);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUpload, // TAMBAHKAN MIDDLEWARE UPLOAD FILE
  movieController.postMovie
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareUpload,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
