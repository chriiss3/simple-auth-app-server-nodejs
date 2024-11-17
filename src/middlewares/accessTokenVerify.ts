import jwt from "jsonwebtoken";
import { validateAccessToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../userModel.js";
import { JWT_ACCESS_SECRET_KEY, JWT_ACCESS_TOKEN_NAME, NODE_ENV } from "../config/env.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.auth_access_token;
  const DEV_ENV = NODE_ENV.trim() === "development";

  try {
    const decoded = await validateAccessToken(accessToken, JWT_ACCESS_SECRET_KEY);
    const userFound = await User.findOne({ _id: decoded.id });

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
        res.clearCookie(JWT_ACCESS_TOKEN_NAME);
        return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
      }
    }
  }
};

export default verifyAccessToken;
