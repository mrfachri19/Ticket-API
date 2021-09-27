const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/:id", bookingController.getBookingById);
Router.get("/:id", bookingController.getBookingByuserId);
Router.get("/", bookingController.getSeatBooking);
Router.post("/", bookingController.postBooking);

module.exports = Router;
