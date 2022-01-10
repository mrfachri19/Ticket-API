const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, bs.seat, m.name, m.category FROM booking AS b JOIN seatbooking AS bs ON b.id = bs.bookingId JOIN movie AS m ON b.movieId = m.id WHERE b.id = ?",
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
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, b.statusUsed, bs.seat, m.name, s.premiere FROM booking AS b JOIN seatbooking AS bs ON b.id = bs.bookingId JOIN movie AS m ON b.movieId = m.id JOIN schedule as s ON b.scheduleId = s.id WHERE b.userId = ?",
        id,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(new Error(`Message : ${error.message}`));
          }
        }
      );
      console.log(query.sql);
    }),

  getSeatBooking: (scheduleId, movieId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT seatbooking.id, seatbooking.seat FROM seatbooking WHERE scheduleId LIKE '%${scheduleId}%' AND movieId LIKE '%${movieId}%' AND dateBooking LIKE '%${dateBooking}%' AND timeBooking LIKE '%${timeBooking}%'`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  postSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO seatbooking SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
  updateBooking: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  getExportTicketByIdBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, bs.seat FROM booking AS b JOIN seatbooking AS bs ON b.id = bs.bookingId WHERE b.userId = ?",
        id,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(new Error(`Message : ${error.message}`));
          }
        }
      );
    }),
  ticketAlready: (statusTicket, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET statusUsed = ? WHERE id = ?",
        [statusTicket, id],
        (error) => {
          if (!error) {
            const setNewData = {
              id,
              statusTicket,
            };
            resolve(setNewData);
          } else {
            reject(new Error(`Message : ${error.message}`));
          }
        }
      );
    }),
  detailBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE id = ?",
        id,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(new Error(`Message : ${error.message}`));
          }
        }
      );
    }),
};
