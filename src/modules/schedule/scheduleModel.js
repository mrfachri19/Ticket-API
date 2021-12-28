const connection = require("../../config/mysql");

module.exports = {
  getAllSchedule: (limit, offset, searchLocation, searchMovieId, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM schedule WHERE ${
          searchMovieId && `movieId = ${searchMovieId} AND`
        }  location LIKE "%${searchLocation}%" ORDER BY price ${sort} LIMIT ? OFFSET ?`,
        [limit, offset, sort],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
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
  // getScheduleByIdMovie: (id) =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       "SELECT * FROM schedule WHERE movieId = ?",
  //       id,
  //       (error, result) => {
  //         if (!error) {
  //           resolve(result);
  //         } else {
  //           reject(new Error(`SQL : ${error.sqlMessage}`));
  //         }
  //       }
  //     );
  //   }),
  getCountSchedule: (searchLocation, searchMovieId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM schedule WHERE location LIKE '%${searchLocation}%' AND movieId LIKE '%${searchMovieId}%'`,
        (err, result) => {
          if (!err) {
            resolve(result[0].total);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  postSchedule: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO schedule SET ?",
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
      // eslint-disable-next-line no-console
      console.log(query.sql);
    }),
  updateSchedule: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id = ?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
  getScheduleByDateStartAndEnd: (dateStart, dateEnd) =>
    new Promise((resolve) => {
      connection.query(
        "SELECT * FROM schedule WHERE dateStart = ? AND dateEnd = ?",
        [dateStart, dateEnd],
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            // eslint-disable-next-line no-new
            new Error(`Message : ${error.message}`);
          }
        }
      );
    }),
};
