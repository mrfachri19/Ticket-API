const express = require("express");

const Router = express.Router();

const authController = require("./authController");
// const middlewareAuth = require("../../middleware/auth");
// const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadUser");

Router.post("/register", middlewareUpload, authController.register);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);

module.exports = Router;
