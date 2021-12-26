const express = require("express");

const Router = express.Router();

const middlewareAuth = require("../../middleware/auth");
const bookingController = require("./bookingController");

Router.get("/:id", bookingController.getBookingById);
Router.get(
  "/user-id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get("/", bookingController.getSeatBooking);
Router.post("/midtrans-notification", bookingController.postMidtransNotif);
Router.get(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.exportTicket
);

module.exports = Router;
