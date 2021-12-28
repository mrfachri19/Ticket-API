const moment = require("moment");
const scheduleModel = require("./scheduleModel");
const helperWrapper = require("../../helper/wrapper");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit, searchLocation, searchMovieId, sort } = request.query;
      // tambahkan proses default value
      page = Number(page) || 1;
      limit = Number(limit) || 15;
      searchLocation = searchLocation || "";
      searchMovieId = searchMovieId || "";
      sort = sort || "price ASC";
      let offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule(
        searchLocation,
        searchMovieId
      );
      const totalPage = Math.ceil(totalData / limit);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
        searchMovieId,
        sort
      );
      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };
        return data;
      });
      redis.setex(
        `getschedule:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        response,
        200,
        "Succes get data",
        newResult,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  getScheduleFilterByDateStartEnd: async (request, response) => {
    try {
      const { dateStart, dateEnd } = request.query;
      const schedules = await scheduleModel.getScheduleByDateStartAndEnd(
        dateStart,
        dateEnd
      );
      const newDataSchedule = [];
      // eslint-disable-next-line array-callback-return
      schedules.map((value) => {
        const setNewValue = {
          ...value,
          time: value.time.split(","),
          dateStart: moment(value.dateStart).format("YYYY-MM-DD"),
          dateEnd: moment(value.dateEnd).format("YYYY-MM-DD"),
        };
        newDataSchedule.push(setNewValue);
      });
      if (newDataSchedule.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Schedule not found!",
          null
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Success Get Data By Date Start and Date End!",
        newDataSchedule
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request ${error.message}`
      );
    }
  },
  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.getScheduleById(id);
      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };
        return data;
      });
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }

      redis.setex(`getSchedule:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        res,
        200,
        "succes get data by id",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  // getScheduleByIdMovie: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const result = await scheduleModel.getScheduleByIdMovie(id);
  //     const newResult = result.map((item) => {
  //       const data = {
  //         ...item,
  //         time: item.time.split(","),
  //       };
  //       return data;
  //     });
  //     if (result.length < 1) {
  //       return helperWrapper.response(
  //         res,
  //         404,
  //         `data by id ${id} not found !`,
  //         null
  //       );
  //     }

  //     redis.setex(`getSchedule:${id}`, 3600, JSON.stringify(result));

  //     return helperWrapper.response(
  //       res,
  //       200,
  //       "succes get data by id",
  //       newResult
  //     );
  //   } catch (error) {
  //     return helperWrapper.response(
  //       res,
  //       400,
  //       `bad request (${error.message})`,
  //       null
  //     );
  //   }
  // },
  postSchedule: async (req, res) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        req.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time: time.split(" ").join(""),
      };

      const result = await scheduleModel.postSchedule(setData);
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
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        req.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time: time.split(" ").join(""),
        updatedAt: new Date(Date.now()),
      };
      // untuk mengupdate salah satu field saja
      Object.keys(setData).forEach((data) => {
        if (!setData[data]) {
          delete setData[data];
        }
      });

      // masi butuh perbaikan
      // for (const data in setData) {
      //   if (!setData[data]) {
      //     delete setData[data];
      //   }
      // }

      const result = await scheduleModel.updateSchedule(setData, id);
      return helperWrapper.response(res, 200, "succes update data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }

      const result = await scheduleModel.deleteSchedule(id);
      return helperWrapper.response(res, 200, "succes delete data", result);
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
