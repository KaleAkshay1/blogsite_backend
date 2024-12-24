import express from "express";
import {
  checkAuth,
  checkOtp,
  logIn,
  logOut,
  registerUser,
} from "../controller/user.controller.js";
import authMiddelware from "../middleware/auth.middleware.js";

const user = express.Router();

user.post("/register", registerUser);
user.post("/check-otp", checkOtp);
user.post("/log-in", logIn);
user.get("/logout", authMiddelware, logOut);
user.get("/check-auth", authMiddelware, checkAuth);

export default user;
