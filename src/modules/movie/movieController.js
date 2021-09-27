const movieModel = require("./movieModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, search, sort } = request.query;
      page = Number(page);
      limit = Number(limit);
      search = search || "";
      sort = sort || "name ASC";

      // tambahkan proses default value
      let offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie();

      const totalPage = Math.ceil(totalData / limit);
      if (totalPage < page) {
        offset = 0;
        page = 1;
        // return helperWrapper.response(
        //   response,
        //   200,
        //   "Succes get data",
        //   result,
        //   pageInfo
        // );
      }
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(limit, offset, search, sort);

      return helperWrapper.response(
        response,
        200,
        "Succes get data",
        result,
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
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieById(id);
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
  postMovie: async (req, res) => {
    try {
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      };
      const result = await movieModel.postMovie(setData);
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
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
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

      const result = await movieModel.updateMovie(setData, id);
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
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      // const { name, category, releaseDate, synopsis } = req.body;
      // const setData = {
      //   name,
      //   category,
      //   releaseDate,
      //   synopsis,
      //   updatedAt: new Date(Date.now()),
      // };

      const result = await movieModel.deleteMovie(id);
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
