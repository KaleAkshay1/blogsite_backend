import asyncHandler from "../utils/async_handler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import sendMail from "../utils/send_mail.js";
import {
  accessById,
  checkUserExist,
  createUser,
} from "../services/db.services.js";
import { checkEncryptedPass, encryptPass } from "../utils/bcrypt.js";
import { signToken, verifyToken } from "../utils/jwt.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new apiError(
      400,
      `${
        !username
          ? "username require"
          : !email
          ? "email require"
          : "password require"
      }`
    );
  }
  if (email.split("@").length !== 2 || !(email.split("@")[1].length > 2)) {
    throw new apiError(401, "invalid email");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const emailsend = await sendMail(email, "One Time Password", String(otp));
  if (!emailsend) {
    throw new apiError(401, "invalid email");
  }
  const encryptedOtp = await signToken({ otp, ip: req.ip }, "5m");

  res
    .cookie("otp", encryptedOtp, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .status(200)
    .json(new ApiResponse(200, req.body));
});

const checkOtp = asyncHandler(async (req, res) => {
  const { otp } = req.cookies;
  const body = req.body;
  if (!otp) {
    throw new apiError(401, "Unauthorized user");
  }

  const decodedOtp = await verifyToken(otp);
  if (String(decodedOtp.otp) !== body?.otp) {
    throw new apiError(401, "invalid OTP");
  }
  if (decodedOtp.ip !== req.ip) {
    throw new apiError(401, "Access Denied");
  }
  if (!body.password) {
    throw new apiError(404, "plese send password");
  }
  const hashedPass = await encryptPass(body.password);
  const user = await createUser({
    username: body.username,
    email: body.email,
    password: hashedPass,
  });
  if (!user || user.length < 1) throw new apiError(200, "invalide data");
  res
    .clearCookie("otp")
    .status(200)
    .json(new ApiResponse(200, "register successfully"));
});

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(400, "username and password require");
  }
  const user = await checkUserExist(email);
  if (user.length < 1) {
    throw new apiError(401, `user not exist with this ${email}`);
  }
  const checkPassword = await checkEncryptedPass(password, user[0].password);
  if (!checkPassword) {
    throw new apiError(401, "Invalid Password");
  }
  const loginToken = await signToken({ id: user[0].id, ip: req.ip }, "1d");
  res
    .cookie("loginToken", loginToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          profile_picture: user[0].profile_picture,
          socialLink: user[0].socialLink,
        },
        "Login Successfull"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  res
    .clearCookie("loginToken")
    .status(200)
    .json(new ApiResponse(200, [], "logout Successfull"));
});

const checkAuth = asyncHandler(async (req, res) => {
  const data = verifyToken(req.cookies?.loginToken);
  if (!data.id) {
    throw new apiError(404, "invalid token");
  }
  const user = await accessById("users", data.id);
  if (user.length === 0) {
    throw new apiError(404, "user not found");
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        profile_picture: user[0].profile_picture,
        socialLink: user[0].socialLink,
      },
      "Login Successfull"
    )
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(404, "email require");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const emailsend = await sendMail(email, "One Time Password", String(otp));
  if (!emailsend) {
    throw new apiError(401, "invalid email");
  }
  const encryptedOtp = await signToken({ otp, ip: req.ip }, "5m");
  res
    .cookie("forgot_otp", encryptedOtp, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .status(200)
    .json(new ApiResponse(200, req.body));
});

const checkForgotOtp = asyncHandler(async () => {
  const { otp } = req.body;
  const { forgot_otp } = req.cookies;
  if (!otp || !forgot_otp) {
    throw new apiError(404, otp ? "plz enter otp again" : "otp is require");
  }
  const decode_forgot_otp = await verifyToken(forgot_otp);
  if (!decode_forgot_otp) {
    throw new apiError(400, "invalid otp");
  }
  if (String(decode_forgot_otp.otp) !== otp.trim()) {
    throw new apiError(400, "invalid otp");
  }
  if (decode_forgot_otp.ip !== req.ip) {
    throw new apiError(401, "Access Denied");
  }
  res
    .clearCookie("decode_forgot_otp")
    .status(200)
    .json(new ApiResponse(200, "verified otp", "otp verify successfull"));
});

const newPassword = asyncHandler(async (req, res) => {});

export {
  registerUser,
  checkOtp,
  logIn,
  logOut,
  checkAuth,
  forgotPassword,
  checkForgotOtp,
};
