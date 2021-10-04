const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleByIdMovie
);
Router.post(
  "/",
  middlewareAuth.isAdmin,
  middlewareAuth.authentication,
  middlewareRedis.clearScheduleRedis,
  scheduleController.postSchedule
);
Router.patch(
  "/:id",
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
