import jwt from "jsonwebtoken";

const signToken = (paylode, expire = "10m") => {
  const token = jwt.sign(paylode, process.env.JWT_SECRET, {
    expiresIn: expire,
  });
  return token;
};

const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    return result;
  } catch (error) {
    console.log("invalid token", error.message);
  }
};

export { verifyToken, signToken };
