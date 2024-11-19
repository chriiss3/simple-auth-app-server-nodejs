import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  AUTH_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRE_TIME,
  AUTH_COOKIE_EXPIRE_TIME,
} from "../config/env.js";
import { UserPayloadTypes } from "../interfaces/user.js";
import { ERROR_MESSAGES, ERROR_NAMES, CLIENT_SUCCES_MESSAGES } from "../constants.js";
import {
  resetUserPassword,
  saveUser,
  setActiveSession,
  validateCredentials,
  removeActiveSession,
  sendResetEmail,
} from "../services/auth.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import User from "../user-model.js";
import { setCookieOptions, AppError, validateUser, isDevelopmentEnv } from "../utils/index.js";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
// import { APIErrorOptions, APIErrorType} from "mailgun.js"

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const passwordHash = await hashPassword(password);

    const user = await saveUser(email, passwordHash, name);

    const accessToken = await generateToken({ userId: user._id }, ACCESS_TOKEN_EXPIRE_TIME);
    const refreshToken = await generateToken({ userId: user._id }, REFRESH_TOKEN_EXPIRE_TIME);

    await setActiveSession(refreshToken, user._id);

    const cookieOptions = setCookieOptions(AUTH_COOKIE_EXPIRE_TIME);

    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);

    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "register"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "register"));
    } else if (err instanceof AppError) {
      err.origin = "register";
      next(err);
    }
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await validateCredentials(email, password);

    const accessToken = await generateToken({ userId: user._id }, ACCESS_TOKEN_EXPIRE_TIME);
    const refreshToken = await generateToken({ userId: user._id }, REFRESH_TOKEN_EXPIRE_TIME);

    await setActiveSession(refreshToken, user._id);

    const cookieOptions = setCookieOptions(AUTH_COOKIE_EXPIRE_TIME);

    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess, accessToken });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "login"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "login"));
    } else if (err instanceof AppError) {
      err.origin = "login";
      next(err);
    }
  }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const backupToken = req.body.backupToken;

  res.clearCookie(AUTH_COOKIE_NAME);

  const decoded = jwt.decode(backupToken);

  if (!decoded) throw new AppError(ERROR_NAMES.Unauthorized, ERROR_MESSAGES.invalidToken, "");

  try {
    await removeActiveSession((decoded as UserPayloadTypes).userId);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "logout"));
    } else if (err instanceof AppError) {
      err.origin = "logout";
      next(err);
    }
  }
};

// Manejar mailgun lanza errores
const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const email = req.body.email;

    const user = await validateUser(email, null);

    const accessToken = await generateToken({ userId: user._id }, ACCESS_TOKEN_EXPIRE_TIME);

    await sendResetEmail(accessToken, email);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "forgotPassword"));
    } else if (err instanceof AppError) {
      err.origin = "forgotPassword";
      next(err);
    }
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const newPassword = req.body.newPassword;
  const heeaderToken = req.headers.authorization?.split(" ")[1] as string;

  try {
    const decoded = await verifyToken(heeaderToken);

    const user = await validateUser(null, (decoded as UserPayloadTypes).userId);

    const isMatch = await validatePassword(newPassword, user.password);
    if (isMatch) throw new AppError(ERROR_NAMES.badRequest, ERROR_MESSAGES.passwordIsMatch, "");

    const passwordHash = await hashPassword(newPassword);

    await resetUserPassword(passwordHash);

    const accessToken = await generateToken({ userId: user._id }, ACCESS_TOKEN_EXPIRE_TIME);
    const refreshToken = await generateToken({ userId: user._id }, REFRESH_TOKEN_EXPIRE_TIME);

    await setActiveSession(refreshToken, user._id);

    const cookieOptions = setCookieOptions(AUTH_COOKIE_EXPIRE_TIME);
    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);

    return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);
    if (err instanceof MongooseError) {
      next(new AppError(err.name, err.message, "resetPassword"));
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError ||
      err instanceof jwt.TokenExpiredError
    ) {
      next(new AppError(err.name, err.message, "resetPassword"));
    } else if (err instanceof AppError) {
      err.origin = "resetPassword";
      next(err);
    }
  }
};

const getNewToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.body.backupToken;

  try {
    // Si el accessToken esta en la lista negra (session cerrada) lanzar error
    const accessTokenDecoded = jwt.decode(accessToken);

    if (!accessTokenDecoded) throw new AppError(ERROR_NAMES.Unauthorized, ERROR_MESSAGES.invalidToken, "");

    const user = await User.findById((accessTokenDecoded as UserPayloadTypes).userId);

    if (!user) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.userNotFound, "");

    if (!user.refreshToken) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.refreshTokenNotFound, "");

    const refreshTokenDecoded = await verifyToken(user.refreshToken);

    const newAccessToken = await generateToken(
      { userId: (refreshTokenDecoded as UserPayloadTypes).userId },
      ACCESS_TOKEN_EXPIRE_TIME
    );

    res.status(200).json({ newAccessToken });
  } catch (err) {
    if (isDevelopmentEnv()) console.error(err);

    res.clearCookie(AUTH_COOKIE_NAME);

    try {
      await removeActiveSession(accessToken);
    } catch (err) {
      if (err instanceof MongooseError) {
        next(new AppError(err.name, err.message, "getNewToken"));
      } else if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.NotBeforeError ||
        err instanceof jwt.TokenExpiredError
      ) {
        next(new AppError(err.name, err.message, "getNewToken"));
      } else if (err instanceof AppError) {
        err.origin = "getNewToken";
        next(err);
      }
    }
  }
};

export { register, login, logout, forgotPassword, resetPassword, getNewToken };
