import express from "express";
import {
  addCategory,
  addPost,
  getCategorys,
  getHomePageData,
  getImageLink,
  getLatestPosts,
  getPosts,
  getSingelPost,
  getTrendingPosts,
  searchBlogs,
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
posts.get("/get-posts/trending", getTrendingPosts);
posts.get("/get-posts/latest", getLatestPosts);
posts.get("/get-posts/:category", getPosts);
posts.get("/get-posts/:category/trending", getTrendingPosts);
posts.get("/get-posts/:category/latest", getLatestPosts);
posts.get("/get-post/:id", getSingelPost);
posts.get("/get-categorys", getCategorys);
posts.get("/get-homepage-data", getHomePageData);
posts.get("/posts/search", searchBlogs);
posts.post(
  "/add-category",
  authMiddelware,
  uplode.single("image"),
  addCategory
);

export default posts;
