import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// use cors for cros platform origin
app.use(cors());

// use middelware for default access of static files
app.use(express.static("public"));

// for accept json data sending in fruntend
app.use(express.json());

app.use(cookieParser());

app.get("/", async (req, res) => {
  res.status(200).json({ name: "akshay" });
});

// import user routes
import user from "./routes/user.routes.js";
app.use("/api/user", user);

// import posts routes
import posts from "./routes/posts.routes.js";
app.use("/api/posts", posts);

export default app;
