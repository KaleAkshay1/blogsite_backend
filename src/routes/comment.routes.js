import express from "express";
import authMiddelware from "../middleware/auth.middleware.js";
import { addComment } from "../controller/comments.controller.js";

const comment = express.Router();

comment.post("/add-comment/:post_id", authMiddelware, addComment);

export default comment;
