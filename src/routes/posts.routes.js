import express from "express";
import { addPost } from "../controller/posts.controller.js";
import { uplode } from "../middleware/multer.middleware.js";
import authMiddelware from "../middleware/auth.middleware.js";

const posts = express.Router();

posts.post("/create", authMiddelware, uplode.any(), addPost);

export default posts;
