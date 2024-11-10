import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";

import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_COOKIE_EXPIRE_TIME,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
} from "../config/env.js";
import { CLIENT_SUCCES_MESSAGES } from "../constants.js";
import { loginUser, registerUser, sendResetLink, resetUserPassword } from "../services/authServices.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { setAuthCookie } from "../utils/cookie.js";
import AppError from "../utils/customError.js";
import handleCritialError from "../utils/criticalErrorHandler.js";

interface SendGridError extends Error {
  response?: {
    statusCode: number;
    body: {
      errors: Array<{
        message: string;
        field?: string;
        help?: string;
      }>;
    };
  };
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    res.clearCookie(JWT_ACCESS_TOKEN_NAME);
    res.clearCookie(JWT_REFRESH_TOKEN_NAME);

    const userSaved = await registerUser(email, password, name);

    const accessToken = await generateAccessToken({ id: userSaved._id }, JWT_ACCESS_SECRET_KEY);
    const refreshToken = await generateRefreshToken({ id: userSaved._id }, JWT_REFRESH_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
    setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_COOKIE_EXPIRE_TIME);

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

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess });
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

const logout = async (req: Request, res: Response) => {
  res.clearCookie(JWT_ACCESS_TOKEN_NAME);
  res.clearCookie(JWT_REFRESH_TOKEN_NAME);

  res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;

    await sendResetLink(email);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
  } catch (err) {
    const sgError = err as SendGridError;

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
    } else if (sgError.response) {
      console.error(sgError.response.body)
      handleCritialError(sgError);
    }
  }
};


const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPassword = req.body.newPassword;
    const heeaderToken = req.headers.authorization?.split(" ")[1] as string;

    const userReset = await resetUserPassword(heeaderToken, newPassword);

    const accessToken = await generateAccessToken({ id: userReset._id }, JWT_ACCESS_SECRET_KEY);
    const refreshToken = await generateRefreshToken({ id: userReset._id }, JWT_REFRESH_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
    setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_COOKIE_EXPIRE_TIME);

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

export { register, login, logout, forgotPassword, resetPassword };

