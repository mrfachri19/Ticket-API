const redis = require("redis");

const client = redis.createClient({
  host: "redis-17632.c51.ap-southeast-2-1.ec2.cloud.redislabs.com",
  port: "17632",
  password: "qvZalbXPK5GCnS3amDuO1bf6WPJrNh0O",
});

client.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("you now connect to db redis");
});

module.exports = client;
