const redis = require("../config/redis");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  getMovieByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getMovie:${id}`, (error, result) => {
      // result = [{"id":3,"name":"Batman","category":"Action","releaseDate":"2021-02-01T17:00:00.000Z","synopsis":"Lorem ipsum ...","createdAt":"2021-09-20T08:37:09.000Z","updatedAt":"2021-09-21T08:47:13.000Z"}]
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data by id",
          newResult
        );
      }
      // eslint-disable-next-line no-console
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
  getMovieRedis: (req, res, next) => {
    redis.get(`getMovie:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result); // {result, pageInfo}
        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult.result,
          newResult.pageInfo
        );
      }
      // eslint-disable-next-line no-console
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
  clearMovieRedis: (req, res, next) => {
    redis.keys("getMovie:*", (error, result) => {
      // result = ["getMovie:1", "getMovie:{\"page\":\"1\",\"limit\":\"3\"}"]
      if (result.length > 0) {
        // PROSES DELETE KEYS
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    next();
  },
  //= ===============================
  getScheduleRedis: (req, res, next) => {
    redis.get(`getSchedule:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result); // {result, pageInfo}
        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult.result,
          newResult.pageInfo
        );
      }
      // eslint-disable-next-line no-console
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
  getScheduleByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getSchedule:${id}`, (error, result) => {
      // result = [{"id":3,"name":"Batman","category":"Action","releaseDate":"2021-02-01T17:00:00.000Z","synopsis":"Lorem ipsum ...","createdAt":"2021-09-20T08:37:09.000Z","updatedAt":"2021-09-21T08:47:13.000Z"}]
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data by id",
          newResult
        );
      }
      // eslint-disable-next-line no-console
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
  clearScheduleRedis: (req, res, next) => {
    redis.keys("getSchedule:*", (error, result) => {
      // result = ["getMovie:1", "getMovie:{\"page\":\"1\",\"limit\":\"3\"}"]
      if (result.length > 0) {
        // PROSES DELETE KEYS
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    next();
  },
  //= =================
  getUserRedis: (req, res, next) => {
    redis.get(`getUser:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result); // {result, pageInfo}
        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult.result,
          newResult.pageInfo
        );
      }
      // eslint-disable-next-line no-console
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
};
