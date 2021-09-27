const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, bs.seat FROM booking AS b JOIN seatbooking AS bs ON b.id = bs.bookingId WHERE b.id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getBookingByuserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, bs.seat FROM booking AS b JOIN seatbooking AS bs ON b.id = bs.bookingId WHERE userId = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, movieId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT seatbooking.id, seatbooking.seat FROM `seatbooking` WHERE scheduleId = ? AND movieId = ? AND dateBooking = ? AND timeBooking = ? ",
        [scheduleId, movieId, dateBooking, timeBooking],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
};
