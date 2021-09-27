const connection = require("../../config/mysql");

module.exports = {
  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO seatbooking SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
};
