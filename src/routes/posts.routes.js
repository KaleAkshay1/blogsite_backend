import express from "express";
import {
  addPost,
  getImageLink,
  getPosts,
  getSingelPost,
} from "../controller/posts.controller.js";
import { uplode } from "../middleware/multer.middleware.js";
import authMiddelware from "../middleware/auth.middleware.js";

const posts = express.Router();

posts.post("/create", authMiddelware, uplode.single("banner"), addPost);
posts.post(
  "/image-uplod",
  authMiddelware,
  uplode.single("image"),
  getImageLink
);
posts.get("/get-posts", getPosts);
posts.get("/get-posts/:category", getPosts);
posts.get("/get-post/:id", getSingelPost);

export default posts;
