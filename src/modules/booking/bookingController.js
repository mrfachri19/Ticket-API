const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helper/wrapper");
const seatBookingModel = require("./seatBookingModel");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      return helperWrapper.response(res, 200, "succes get data by id", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  getBookingByuserId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingByuserId(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      return helperWrapper.response(res, 200, "succes get data by id", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  getSeatBooking: async (req, res) => {
    try {
      const { movieId, scheduleId, dateBooking, timeBooking } = req.query;
      const result = await bookingModel.getSeatBooking(
        movieId,
        scheduleId,
        dateBooking,
        timeBooking
      );
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${
            (movieId, scheduleId, dateBooking, timeBooking)
          } not found !`,
          null
        );
      }
      return helperWrapper.response(res, 200, "succes get data by id", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  postBooking: async (req, res) => {
    try {
      const {
        userId,
        scheduleId,
        movieId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
        seat,
      } = req.body;
      const setDataBooking = {
        userId,
        scheduleId,
        movieId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
      };
      let result = await bookingModel.postBooking(setDataBooking);
      seat.forEach(async (item) => {
        const setDataSeat = {
          bookingId: result.id,
          movieId,
          scheduleId,
          dateBooking,
          timeBooking,
          ...item,
        };
        await seatBookingModel.postBooking(setDataSeat);
      });
      result = { ...result, seat };
      return helperWrapper.response(res, 200, "Succes create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
};
