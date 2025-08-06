import jwt from "jsonwebtoken";

const KEY = "kjfkldsfjskdfjksldfjskdfjlksdjksldfjljkdlsfjlkj";
export const generateToken = (value: string) => {
  const token = jwt.sign(value, KEY, {});
  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, KEY);
};
