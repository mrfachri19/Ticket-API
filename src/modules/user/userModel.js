const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id = ?", id, (err, result) => {
        if (!err) {
          const newResult = result;
          delete newResult[0].password;
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
  updateUser: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`Message ${error.message}`));
          }
        }
      );
    }),
  updateImage: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getDashboardUser: (movieId, location, premiere) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTHNAME(b.createdAt) AS month, SUM(b.totalPayment) AS total FROM booking AS b JOIN schedule AS s ON b.movieId = s.movieId WHERE YEAR(b.createdAt) = YEAR(NOW()) AND b.movieId LIKE '%${movieId}%' AND s.premiere LIKE '%${premiere}%' AND s.location LIKE '%${location}%' GROUP BY MONTH(b.createdAt)`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
};
