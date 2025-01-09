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
// app.use(express.urlencoded());

app.use(cookieParser());

app.get("/", async (req, res) => {
  res.status(200).json({ name: "akshay" });
});

// import user routes
import auth from "./routes/auth.routes.js";
app.use("/api/auth", auth);

// import posts routes
import posts from "./routes/posts.routes.js";
app.use("/api/posts", posts);

// import comment routes
import comment from "./routes/comment.routes.js";
app.use("/api/comment", comment);

export default app;
