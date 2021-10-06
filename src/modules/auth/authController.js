const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const redis = require("../../config/redis");

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, noTelp, email, password } = req.body;
      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BLM DI DATABASE
      // PROSES ENCRYPT PASSWORD
      const hashPassword = await bcryptjs.hash(password, 10);

      const setData = {
        id: uuidv4(),
        firstName,
        lastName,
        image: req.file ? req.file.filename : null,
        noTelp,
        email,
        password: hashPassword,
        role: "user",
      };

      const result = await authModel.register(setData);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await authModel.getUserByEmail(email);

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not registed", null);
      }

      const passwordUser = await bcryptjs.compare(
        password,
        checkUser[0].password
      );
      // console.log(checkUser[0]);
      if (!passwordUser) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }

      // PROSES UTAMA MEMBUAT TOKEN MENGGUNAKAN JWT (DATA YANG MAU DIUBAH, KATA KUNCI, LAMA TOKEN BISA DIGUNAKAN )
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "24h",
      });
      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
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
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      redis.setex(`accesToken:${token}`, 3600 * 24, token);
      return helperWrapper.response(res, 200, "Success logout", null);
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
