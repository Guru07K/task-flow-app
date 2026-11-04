import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  RESP: 2,
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

export default redisClient;
