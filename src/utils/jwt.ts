import jwt from "jsonwebtoken";
import { UserTokenPayloadTypes } from "../interfaces/userInterfaces.js";

const generateAccessToken = (payload: { id: string }, secretKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

const generateRefreshToken = (payload: { id: string }, secretKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn: "30d" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

const validateAccessToken = (token: string, secretKey: string): Promise<UserTokenPayloadTypes> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as UserTokenPayloadTypes);
      }
    });
  });
};

const validateRefreshToken = (token: string, secretKey: string): Promise<UserTokenPayloadTypes> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as UserTokenPayloadTypes);
      }
    });
  });
};

export { generateAccessToken, generateRefreshToken, validateAccessToken, validateRefreshToken };
