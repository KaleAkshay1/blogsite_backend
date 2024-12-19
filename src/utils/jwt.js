import jwt from "jsonwebtoken";

const signToken = (paylode) => {
  const token = jwt.sign(paylode, process.env.JWT_SECRET, { expiresIn: "5s" });
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
