import jwt from "jsonwebtoken";

const KEY =
  "kjfkldsfjskdfjksldfjskdfjlksdjkfdlskfsdfjsdjfklsjflkdj802340234809fljsldfjljkdlsfjlkj";

type Payload = {
  id: string;
  email: string;
};
export const generateToken = (payload: Payload) => {
  const token = jwt.sign(payload, KEY);
  return token;
};

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, KEY);
  if (!payload) return null;
  return payload as Payload;
};
