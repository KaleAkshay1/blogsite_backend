import express from "express";
import { addPost } from "../controller/posts.controller.js";
import { uplode } from "../middleware/multer.middleware.js";
import pool from "../config/database.connection.js";
import { accessAllData } from "../services/db.services.js";

const posts = express.Router();

posts.post("/add-post", uplode.any(), addPost);

posts.get("/post", async (req, res) => {
  try {
    const data = await acessAllData("posts");
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ errors: "Failed to fetch posts" });
  }
});

export default posts;
