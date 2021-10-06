// const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const helperWrapper = require("../../helper/wrapper");
const userModel = require("./userModel");
const redis = require("../../config/redis");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userModel.getUserById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      // PROSES UNTUK MENYIMPAN DATA KE DALAM REDIS
      // =====
      redis.setex(`getUser:${id}`, 3600, JSON.stringify(result));
      // ======
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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, confirmPassword } = req.body;
      if (newPassword === confirmPassword) {
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(confirmPassword, salt);
        const data = { password: hash };
        const result = await userModel.get(id, data);
        if (result.affectedRows) {
          return helperWrapper.response(res, 200, "Success update pass");
        }
      }
      return helperWrapper.response(res, 403, "pass tidak sama");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }
      const { firstName, lastName, noTelp, email } = req.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
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

      const result = await userModel.updateUser(setData, id);
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
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found !`,
          null
        );
      }

      const setData = {
        image: req.file ? req.file.filename : null,
      };

      const result = await userModel.updateImage(setData, id);
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
  getDashboardUser: async (req, res) => {
    try {
      const { movieId, location, premiere } = req.query;
      const result = await userModel.getDashboardUser(
        movieId,
        location,
        premiere
      );
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${(movieId, location, premiere)} not found !`,
          null
        );
      }
      return helperWrapper.response(
        res,
        200,
        "succes get data dashboard ",
        result
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
};
