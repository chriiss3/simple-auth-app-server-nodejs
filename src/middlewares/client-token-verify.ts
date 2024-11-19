import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../user-model.js";
import { AUTH_COOKIE_NAME, NODE_ENV } from "../config/env.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { UserPayloadTypes } from "../interfaces/user.js";

const DEV_ENV = NODE_ENV.trim() === "development";

const verifyClientToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.auth_access_token;

  try {
    const decoded = await verifyToken(accessToken);
    const userFound = await User.findOne({ _id: (decoded as UserPayloadTypes).id });

    if (!userFound) return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.userNotFound });

    req.user = {
      email: userFound.email,
      password: userFound.password,
      name: userFound.name,
      refreshToken: userFound.refreshToken,
      sessionActive: userFound.sessionActive,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      id: userFound._id,
    };

    next();
  } catch (err) {
    if (DEV_ENV) console.error(err);

    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.NotBeforeError
    ) {
      if (err.message === "jwt must be provided") {
        return res.sendStatus(401);
      } else {
        res.clearCookie(AUTH_COOKIE_NAME);
        return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
      }
    }
  }
};

export default verifyClientToken;
