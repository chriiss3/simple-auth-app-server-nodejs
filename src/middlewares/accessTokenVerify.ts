import jwt from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../userModel.js";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
  NODE_ENV,
} from "../config/env.js";
import { setAuthCookie, removeAuthCookie } from "../utils/cookie.js";
import { UserTypes } from "../userInterfaces.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.auth_refresh_token;
  const accessToken = req.cookies.auth_access_token;
  const useGenericErrorMessages: boolean = NODE_ENV.trim() === "production";

  try {
    const decoded = await validateAccessToken(accessToken, JWT_ACCESS_SECRET_KEY);

    const userFound = (await User.findOne({ _id: decoded.id })) as UserTypes;

    req.user = {
      name: userFound.name,
      email: userFound.email,
      password: userFound.password,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      id: userFound._id,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      try {
        const decoded = await validateRefreshToken(refreshToken, JWT_REFRESH_SECRET_KEY);

        const userFound = (await User.findOne({ _id: decoded.id })) as UserTypes;

        if (!userFound) {
          removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

          if (useGenericErrorMessages) {
            res.status(404).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });
          } else {
            res.status(404).json({ error: "No se encontro una cuenta activa en el token de refreso" });
          }

          return;
        }

        const newAccessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

        setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, newAccessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

        next();
      } catch (err) {
        removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

        if (err instanceof jwt.JsonWebTokenError) {
          if (useGenericErrorMessages) {
            res.status(401).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });
          } else {
            res.status(401).json({ error: err.message });
          }
        }

        // res.status(401).json({ error: Sesion expirada, vuelve a iniciar sesion });
      }

      if (!useGenericErrorMessages) {
        console.error(err);
      }
    }
  }
};

export default verifyAccessToken;
