import express from "express";
import {
  checkAuth,
  checkForgotOtp,
  checkOtp,
  forgotPassword,
  logIn,
  logOut,
  newPassword,
  registerUser,
} from "../controller/auth.controller.js";
import authMiddelware from "../middleware/auth.middleware.js";

const auth = express.Router();

auth.post("/register", registerUser);
auth.post("/check-otp", checkOtp);
auth.post("/log-in", logIn);
auth.get("/logout", authMiddelware, logOut);
auth.get("/check-auth", authMiddelware, checkAuth);
auth.post("/forgot-password", forgotPassword);
auth.post("/check-forgot-otp", checkForgotOtp);
auth.post("/new-password", newPassword);
export default auth;
