import Redis from "ioredis";

export const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

const connectRedis = () => {
  redis.on("connect", () => {
    console.log("redis connected succesfully");
  });
};

export default connectRedis;
