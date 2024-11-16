import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";

import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
  NODE_ENV,
} from "../config/env.js";
import { UserTokenPayloadTypes } from "../interfaces/userInterfaces.js";
import { CLIENT_SUCCES_MESSAGES } from "../constants.js";
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

    res.clearCookie(JWT_ACCESS_TOKEN_NAME);
    res.clearCookie(JWT_REFRESH_TOKEN_NAME);

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

    const userFound = await loginUser(email, password);

    const accessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

    res.clearCookie(JWT_ACCESS_TOKEN_NAME);
    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess, accessToken });
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
      next(new AppError(err.name, err.message, "login"));
    }
  }
};

const logout = async (req: Request, res: Response) => {
  const accessToken = req.body.backupToken;

  logoutUser(accessToken);

  res.clearCookie(JWT_ACCESS_TOKEN_NAME);

  res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;

    await sendResetLink(email);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
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

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPassword = req.body.newPassword;
    const heeaderToken = req.headers.authorization?.split(" ")[1] as string;

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

const getNewToken = async (req: Request, res: Response) => {
  const accessToken = req.body.backupToken;

  try {
    const decoded = jwt.decode(accessToken) as UserTokenPayloadTypes;
    if (!decoded) return res.sendStatus(401); // mandar al middleware de error

    const userFound = await User.findOne({ _id: decoded.id });
    if (!userFound) return res.sendStatus(404); // mandar al middleware de error
    if (!userFound.refreshToken) return res.sendStatus(401); // mandar al middleware de error

    const refreshTokenDecoded = await validateRefreshToken(userFound.refreshToken, JWT_REFRESH_SECRET_KEY);

    const newAccessToken = await generateAccessToken({ id: refreshTokenDecoded.id }, JWT_ACCESS_SECRET_KEY);

    res.status(200).json({ newAccessToken });
  } catch (err) {
    if (
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError
    ) {
      if (DEV_ENV) console.error(err);

      logoutUser(accessToken)

      res.clearCookie(JWT_ACCESS_TOKEN_NAME);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Sesion expirada, vuelve a iniciar sesion" });
      } else {
        return res.status(401).json({ error: "Error de autenticación, vuelve a iniciar sesion" });
      }
    }
  }
};

export { register, login, logout, forgotPassword, resetPassword, getNewToken };
