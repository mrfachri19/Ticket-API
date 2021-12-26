const express = require("express");

const Router = express.Router();

const middlewareAuth = require("../../middleware/auth");
const bookingController = require("./bookingController");

Router.post("/", middlewareAuth.authentication, bookingController.postBooking);

module.exports = Router;
