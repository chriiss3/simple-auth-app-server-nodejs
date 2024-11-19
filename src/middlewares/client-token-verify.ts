import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../user-model.js";
import { AUTH_COOKIE_NAME } from "../config/env.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { UserPayloadTypes } from "../interfaces/user.js";
import { isDevelopmentEnv } from "../utils/index.js";

const verifyClientToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.auth_access_token;

  try {
    const decoded = await verifyToken(accessToken);
    const user = await User.findById((decoded as UserPayloadTypes).userId);

    if (!user) return res.status(404).json({ error: CLIENT_ERROR_MESSAGES.userNotFound });

    req.user = {
      email: user.email,
      password: user.password,
      name: user.name,
      refreshToken: user.refreshToken,
      sessionActive: user.sessionActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      id: user._id,
    };

    next();
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);
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
