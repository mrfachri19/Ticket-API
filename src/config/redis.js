const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("you now connect to db redis");
});

module.exports = client;
