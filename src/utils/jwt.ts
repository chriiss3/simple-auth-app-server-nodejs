import jwt, { VerifyErrors } from "jsonwebtoken";
import { UserPayloadTypes } from "../interfaces/user.js";
import { JWT_SECRET_KEY } from "../config/env.js";

const generateToken = (payload: { userId: string }, expireTime: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: expireTime }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

const verifyToken = (token: string): Promise<UserPayloadTypes | VerifyErrors> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as UserPayloadTypes);
      }
    });
  });
};

export { verifyToken, generateToken };
