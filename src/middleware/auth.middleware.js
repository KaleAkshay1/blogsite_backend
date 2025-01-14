import { accessById } from "../services/db.services.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/async_handler.js";
import { verifyToken } from "../utils/jwt.js";

const authMiddelware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.loginToken;
  if (!token) {
    throw new apiError(401, "Unautorizze persone");
  }
  const verifiedToken = await verifyToken(token);
  if (!verifiedToken.id) {
    throw new apiError(401, "Invalid Token");
  }
  if (req.ip !== verifiedToken.ip) {
    throw new apiError(401, "Unautorizze persone");
  }
  const user = await accessById("users", verifiedToken?.id);
  if (user.length !== 1) {
    throw new apiError(401, "Invalid user");
  }
  req.user = {
    id: user[0]?.id,
    username: user[0]?.username,
    email: user[0]?.email,
    role: user[0]?.role,
  };
  next();
});

export default authMiddelware;
