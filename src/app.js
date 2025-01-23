import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// use cors for cros platform origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// use middelware for default access of static files
app.use(express.static("public"));

// for accept json data sending in fruntend
app.use(express.json());
// app.use(express.urlencoded());

app.use(cookieParser());

// import user routes
import auth from "./routes/auth.routes.js";
app.use("/api/auth", auth);

// import posts routes
import posts from "./routes/posts.routes.js";
app.use("/api/posts", posts);

// import comment routes
import comment from "./routes/comment.routes.js";
app.use("/api/comment", comment);

// import user routes
import user from "./routes/user.routes.js";
app.use("/api/user", user);

export default app;
