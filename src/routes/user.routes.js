import express from "express";
import {
  deletePostsByUser,
  myPosts,
  updateProfileImage,
} from "../controller/user.controller.js";
import { uplode } from "../middleware/multer.middleware.js";
import authMiddelware from "../middleware/auth.middleware.js";

const user = express.Router();

user.patch(
  "/update-profile/:id",
  authMiddelware,
  uplode.single("profile_picture"),
  updateProfileImage
);

user.get("/get-user-posts/:user_id", authMiddelware, myPosts);
user.delete("/delete-post/:post_id", authMiddelware, deletePostsByUser);

export default user;
