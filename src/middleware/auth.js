const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis");

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first");
    }
    token = token.split(" ")[1];

    redis.get(`accessToken:${token}`, (error, result) => {
      if (!error && result !== null) {
        return helperWrapper.response(
          res,
          403,
          "Your token is destroyed please login again"
        );
      }

      // eslint-disable-next-line no-shadow
      jwt.verify(token, "RAHASIA", (error, result) => {
        if (error) {
          return helperWrapper.response(res, 403, error.message);
        }
        req.decodeToken = result;
        next();
      });
    });
  },
  isAdmin: (req, res, next) => {
    const { role } = req.decodeToken;
    if (role !== "admin") {
      return helperWrapper.response(res, 400, `Role user must be admin`, null);
    }
    next();
  },
};
