import app from "./app.js";
import dotenv from "dotenv";
import connectRedis from "./config/redis.connection.js";
dotenv.config();

connectRedis();

app.listen(process.env.PORT);
