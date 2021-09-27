const express = require("express");

const Router = express.Router();

const helloController = require("./helloController");

// Router.get("/", (request, response) => {
//   response.send("hello World");
// });

Router.get("/", helloController.getHello);

module.exports = Router;
