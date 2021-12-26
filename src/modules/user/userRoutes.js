const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
//= ================================================================
const middlewareUpload = require("../../middleware/uploadUser");
//= ===================================================================

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getUserRedis,
  userController.getUserById
);
Router.patch(
  "/update-profile",
  middlewareAuth.authentication,
  userController.updateUser
);
Router.get("/dashboard", userController.getDashboardUser);
Router.patch(
  "/update-password/:id",
  middlewareAuth.authentication,
  userController.updatePassword
);
Router.post("/:id", middlewareUpload, userController.updateImage);
module.exports = Router;
