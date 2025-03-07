import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Store in .env file

export const signJwt = (payload: object, expiresIn = "1d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
