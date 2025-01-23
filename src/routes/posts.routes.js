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
import { checkCasheofBlog } from "../middleware/redis.middelware.js";

const posts = express.Router();

posts.post("/create", authMiddelware, uplode.single("banner"), addPost);
posts.post(
  "/image-uplod",
  authMiddelware,
  uplode.single("image"),
  getImageLink
);
posts.get("/get-posts", checkCasheofBlog(), getPosts);
posts.get(
  "/get-posts/trending",
  checkCasheofBlog("trending"),
  getTrendingPosts
);
posts.get("/get-posts/latest", checkCasheofBlog("latest"), getLatestPosts);
posts.get("/get-posts/:category", checkCasheofBlog(), getPosts);
posts.get(
  "/get-posts/:category/trending",
  checkCasheofBlog("trending"),
  getTrendingPosts
);
posts.get(
  "/get-posts/:category/latest",
  checkCasheofBlog("latest"),
  getLatestPosts
);
posts.get("/get-post/:id", getSingelPost);
posts.get("/get-categorys", checkCasheofBlog("categorys"), getCategorys);
posts.get("/get-homepage-data", checkCasheofBlog("home-page"), getHomePageData);
posts.get("/posts/search", searchBlogs);
posts.post(
  "/add-category",
  authMiddelware,
  uplode.single("image"),
  addCategory
);

export default posts;
