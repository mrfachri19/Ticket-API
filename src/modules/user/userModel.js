const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT user.id, user.firstName, user.lastName, user.email, user.noTelp, user.role, user.image FROM user WHERE id = ?",
        id,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(new Error(`Message : ${error.message}`));
          }
        }
      );
      // eslint-disable-next-line no-console
      console.log(query.sql);
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
        `SELECT MONTHNAME(b.createdAt) AS month, SUM(b.totalPayment) AS total FROM booking AS b JOIN schedule AS s ON b.movieId = s.movieId WHERE YEAR(b.createdAt) = YEAR(NOW()) AND b.movieId LIKE '%${movieId}%' AND s.premiere LIKE '%${premiere}%' AND s.location LIKE '%${location}%' GROUP BY MONTHNAME(b.createdAt)`,
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
