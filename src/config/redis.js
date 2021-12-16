const redis = require("redis");

const client = redis.createClient({
  host: "redis-18197.c291.ap-southeast-2-1.ec2.cloud.redislabs.com",
  port: "18197",
  password: "gch3u4tJuhhBA2UPrbT0BzN3nF8JymLQ",
});

client.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("you now connect to db redis");
});

module.exports = client;
