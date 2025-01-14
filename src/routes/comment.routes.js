import express from "express";
import authMiddelware from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getAllCommentOfPost,
  replayToComment,
} from "../controller/comments.controller.js";

const comment = express.Router();

comment.post("/add-comment/:post_id", authMiddelware, addComment);
comment.post(
  "/replay-to-comment/:post_id/:comment_id",
  authMiddelware,
  replayToComment
);
comment.get("/get-post-comments/:post_id", authMiddelware, getAllCommentOfPost);
comment.delete("/delete-comment/:comment_id", authMiddelware, deleteComment);

export default comment;
