/* eslint-disable object-shorthand */
const { v4: uuidv4 } = require("uuid");
const ejs = require("ejs");
const path = require("path");
const htmlPdf = require("html-pdf");
const moment = require("moment");
const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("../schedule/scheduleModel");
const midtrans = require("../../helper/midtrans");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await bookingModel.getBookingById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const newResult = [{ ...result[0], seat: [] }];

      result.forEach((item) => {
        newResult[0].seat.push(item.seat);
      });

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getBookingByUserId: async (req, res) => {
    try {
      const { id } = req.decodeToken;
      console.log(req.decodeToken);

      const booking = await bookingModel.getBookingByUserId(id);

      if (booking.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by ${id} not found !`,
          null
        );
      }

      const output = [];

      booking.forEach((item) => {
        const existing = output.filter((v) => v.scheduleId === item.scheduleId);

        if (existing.length) {
          const existingIndex = output.indexOf(existing[0]);
          output[existingIndex].seat = output[existingIndex].seat.concat(
            item.seat
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          if (typeof item.seat === "string") item.seat = [item.seat];
          output.push(item);
        }
      });

      return helperWrapper.response(res, 200, `Success get data by id`, output);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getSeatBooking: async (req, res) => {
    try {
      let { scheduleId, movieId, dateBooking, timeBooking } = req.query;
      scheduleId = scheduleId || "";
      movieId = movieId || "";
      dateBooking = dateBooking || "";
      timeBooking = timeBooking || "";

      const result = await bookingModel.getSeatBooking(
        scheduleId,
        movieId,
        dateBooking,
        timeBooking
      );

      if (result.length < 1) {
        return helperWrapper.response(res, 200, `Data not found !`, []);
      }

      return helperWrapper.response(res, 200, `Success get data by id`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postBooking: async (req, res) => {
    try {
      const { scheduleId, dateBooking, timeBooking, paymentMethod, seat } =
        req.body;

      const { id } = req.decodeToken;

      const schedule = await scheduleModel.getScheduleById(scheduleId);
      if (schedule < 1) {
        return helperWrapper.response(
          res,
          404,
          `Schedule by id ${scheduleId} not found !`,
          null
        );
      }

      // [1]
      const setDataBooking = {
        id: uuidv4(),
        userId: id,
        scheduleId,
        movieId: schedule[0].movieId,
        totalTicket: seat.length,
        // eslint-disable-next-line radix
        totalPayment: seat.length * schedule[0].price,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment: "pending",
      };
      // eslint-disable-next-line no-console
      console.log(schedule);

      await bookingModel.postBooking(setDataBooking);

      // [2]
      const setDataSeatBooking = {
        bookingId: setDataBooking.id,
        scheduleId,
        movieId: schedule[0].movieId,
        dateBooking,
        timeBooking,
      };

      seat.map(async (item) => {
        await bookingModel.postSeatBooking({
          ...setDataSeatBooking,
          seat: item,
        });
      });

      // [3] midtrans proses
      const resultMidtrans = await midtrans.post(
        setDataBooking.id,
        setDataBooking.totalPayment
      );

      const result = {
        id: setDataBooking.id,
        userId: id,
        scheduleId,
        movieId: schedule[0].movieId,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment: setDataBooking.statusPayment,
        seat,
      };

      await bookingModel.updateBooking(
        { linkPayment: resultMidtrans },
        setDataBooking.id
      );

      // eslint-disable-next-line no-console
      console.log(resultMidtrans);
      return helperWrapper.response(res, 200, "Success create data", {
        ...result,
        urlRedirect: resultMidtrans,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postMidtransNotif: async (req, res) => {
    try {
      // eslint-disable-next-line no-console
      console.log(req.body);
      const result = await midtrans.notif(req.body);
      const {
        order_id: bookingId,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      } = result;
      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          // [1]
          const setData = {
            statusPayment: "Success",
            statusUsed: "Active",
            updatedAt: new Date(Date()),
          };
          // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
          await bookingModel.updateBooking(setData, bookingId);
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // [1]
        const setData = {
          statusPayment: "Success",
          statusUsed: "Active",
          updatedAt: new Date(Date()),
        };
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
        await bookingModel.updateBooking(setData, bookingId);
        console.log(setData);
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // [1]
        const setData = {
          statusPayment: "failed",
          statusUsed: "notActive",
          updatedAt: new Date(Date()),
        };
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI GAGAL
        await bookingModel.updateBooking(setData, bookingId);
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      }
      return helperWrapper.response(res, 200, "Success", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  // eslint-disable-next-line func-names
  exportTicketUserBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const fileName = `ticket-${id}.pdf`;
      const userBooking = await bookingModel.getExportTicketByIdBooking(id);
      // join seat => ['A1', 'A2', 'A3']
      // console.log(userBooking);

      const seatBooking = userBooking.map((value) => value.seat);
      const newData = [];
      // eslint-disable-next-line array-callback-return
      userBooking.map((value) => {
        const setNewData = {
          ...value,
        };
        newData.push(setNewData);
      });
      const newDataBooking = newData[0];
      const newDataBookingTicket = {
        ...newDataBooking,
        dateBooking: moment().format("DD MMM"),
        timeBooking: moment().format("LT"),
        seat: seatBooking,
        ticketActive: `http://${request.get("host")}/booking/used-ticket/${
          newDataBooking.id
        }`,
      };
      ejs.renderFile(
        path.resolve("./src/templates/pdf/ticket.ejs"),
        { newDataBookingTicket },
        (error, results) => {
          if (!error) {
            const options = {
              height: "11.25in",
              width: "10.5in",
            };
            htmlPdf.create(results, options).toFile(
              path.resolve(`./public/generate/${fileName}`),
              // eslint-disable-next-line no-shadow
              (error) => {
                if (error) {
                  return helperWrapper.response(response, 400, error.message);
                }
                return helperWrapper.response(
                  response,
                  200,
                  "Success Generate Ticket!",
                  [newDataBookingTicket]
                );
              }
            );
          }
        }
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request : ${error.message}`
      );
    }
  },
  ticketAlreadyUsed: async (request, response) => {
    try {
      const bookingId = request.params.id;
      const checkBooking = await bookingModel.detailBookingById(bookingId);
      if (checkBooking.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Booking not found!",
          null
        );
      }

      const userUsedTicket = "alreadyUsed";
      const newDataTicket = await bookingModel.ticketAlready(
        userUsedTicket,
        bookingId
      );
      if (checkBooking[0].statusUsed === "Active") {
        return helperWrapper.response(
          response,
          200,
          "Success Change status, Ticket has been already used!",
          newDataTicket
        );
      }
      return helperWrapper.response(
        response,
        409,
        "Ticket sudah terpakai!",
        checkBooking
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request : ${error.message}`
      );
    }
  },
};
