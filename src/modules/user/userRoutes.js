const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
//= ================================================================
const middlewareUpload = require("../../middleware/uploadUser");
//= ===================================================================

Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getUserRedis,
  userController.getUserById
);
Router.patch("/:id", userController.updateUser);
Router.get("/", userController.getDashboardUser);
Router.put("/:id", userController.updatePassword);
Router.post("/:id", middlewareUpload, userController.updateImage);
module.exports = Router;
