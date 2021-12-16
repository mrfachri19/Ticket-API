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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, confirmPassword } = req.body;

      const user = await userModel.getUserById(id);
      if (user.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Get data user by id ${id} not found`,
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          res,
          400,
          `Password does not match`,
          null
        );
      }

      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(newPassword, salt);

      const setData = { password: passwordHash };

      const result = await userModel.updateUser(setData, id);

      return helperWrapper.response(res, 200, `Success update password`, {
        id: result.id,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
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
      let { movieId, location, premiere } = req.query;
      movieId = movieId || "";
      premiere = premiere || "";
      location = location || "";
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
