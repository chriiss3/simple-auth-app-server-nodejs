import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
  NODE_ENV,
} from "../config/env.js";
import { UserTokenPayloadTypes } from "../interfaces/userInterfaces.js";
import { ERROR_MESSAGES, ERROR_NAMES, CLIENT_SUCCES_MESSAGES } from "../constants.js";
import { loginUser, registerUser, sendResetLink, resetUserPassword, logoutUser } from "../services/authServices.js";
import { generateAccessToken } from "../utils/jwt.js";
import { setAuthCookie } from "../utils/cookie.js";
import AppError from "../utils/customError.js";
import User from "../userModel.js";
import { validateRefreshToken } from "../utils/jwt.js";

const DEV_ENV = NODE_ENV.trim() === "development";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    const userSaved = await registerUser(email, password, name);

    const accessToken = await generateAccessToken({ id: userSaved._id }, JWT_ACCESS_SECRET_KEY);
    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
  } catch (err) {
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "register"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "register"));
    } else if (err instanceof AppError) {
      next(new AppError(err.name, err.message, "register"));
    }
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const userLogged = await loginUser(email, password);

    const accessToken = await generateAccessToken({ id: userLogged._id }, JWT_ACCESS_SECRET_KEY);
    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess, accessToken });
  } catch (err) {
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "login"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "login"));
    } else if (err instanceof AppError) {
      next(new AppError(err.name, err.message, "login"));
    }
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.body.backupToken;
  res.clearCookie(JWT_ACCESS_TOKEN_NAME);

  try {
    await logoutUser(accessToken);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
  } catch (err) {
    if (DEV_ENV) console.error(err);

    if (err instanceof AppError) {
      next(new AppError(err.name, err.message, "logout"));
    }
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;

    await sendResetLink(email);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
  } catch (err) {
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "forgotPassword"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "forgotPassword"));
    } else if (err instanceof AppError) {
      next(new AppError(err.name, err.message, "forgotPassword"));
    }
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const newPassword = req.body.newPassword;
  const heeaderToken = req.headers.authorization?.split(" ")[1] as string;

  try {
    const userReset = await resetUserPassword(heeaderToken, newPassword);

    const accessToken = await generateAccessToken({ id: userReset._id }, JWT_ACCESS_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

    return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
  } catch (err) {
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "resetPassword"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "resetPassword"));
    } else if (err instanceof AppError) {
      next(new AppError(err.name, err.message, "resetPassword"));
    }
  }
};

const getNewToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.body.backupToken;

  try {
    const accessTokenDecoded = jwt.decode(accessToken) as UserTokenPayloadTypes;

    if (!accessTokenDecoded) throw new AppError(ERROR_NAMES.Unauthorized, ERROR_MESSAGES.invalidToken, "");

    const userFound = await User.findOne({ _id: accessTokenDecoded.id });

    if (!userFound) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.userNotFound, "");
    if (!userFound.refreshToken) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.refreshTokenNotFound, "");

    const refreshTokenDecoded = await validateRefreshToken(userFound.refreshToken, JWT_REFRESH_SECRET_KEY);

    const newAccessToken = await generateAccessToken({ id: refreshTokenDecoded.id }, JWT_ACCESS_SECRET_KEY);

    res.status(200).json({ newAccessToken });
  } catch (err) {
    if (DEV_ENV) console.error(err);

    res.clearCookie(JWT_ACCESS_TOKEN_NAME);

    try {
      await logoutUser(accessToken);
    } catch (err) {
      if (err instanceof AppError) {
        next(new AppError(err.name, err.message, "getNewToken"));
      } else if (
        err instanceof jwt.TokenExpiredError ||
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.NotBeforeError
      ) {
        next(new AppError(err.name, err.message, "getNewToken"));
      }
    }
  }
};

export { register, login, logout, forgotPassword, resetPassword, getNewToken };
