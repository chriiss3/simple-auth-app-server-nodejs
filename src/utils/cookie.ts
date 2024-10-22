import { Response } from "express";
import { NODE_ENV } from "../config/env";

const setAuthCookie = (res: Response, name: string, value: string, maxAge: number) => {
  const cookieOptions = {
    httpOnly: NODE_ENV.trim() === "production",
    secure: NODE_ENV.trim() === "production",
    sameSite: false,
    maxAge: maxAge,
  };

  res.cookie(name, value, cookieOptions);
};

const removeAuthCookie = (res: Response, name: string) => {
  res.cookie(name, "", { maxAge: 0 });
};

export { setAuthCookie, removeAuthCookie };

// maxAge:new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
