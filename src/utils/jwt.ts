import jwt from "jsonwebtoken";
import { TokenPayloadTypes } from "../userInterfaces";

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
    jwt.sign(payload, secretKey, { expiresIn: "7d" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

const validateAccessToken = (token: string, secretKey: string): Promise<TokenPayloadTypes> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as TokenPayloadTypes);
      }
    });
  });
};

const validateRefreshToken = (token: string, secretKey: string): Promise<TokenPayloadTypes> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as TokenPayloadTypes);
      }
    });
  });
};

export { generateAccessToken, generateRefreshToken, validateAccessToken, validateRefreshToken };
