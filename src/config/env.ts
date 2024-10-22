import { config } from "dotenv";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";

config({ path: envFile });

const CLIENT_URL = process.env.CLIENT_URL as string;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
const DB_URL = process.env.DB_URL as string;
const PORT = Number(process.env.PORT);
const IS_GITHUB_REPO = process.env.IS_GITHUB_REPO as string;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME as string;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY as string;
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY as string;
const JWT_REFRESH_TOKEN_NAME = process.env.JWT_REFRESH_TOKEN_NAME as string;
const JWT_ACCESS_TOKEN_NAME = process.env.JWT_ACCESS_TOKEN_NAME as string;
const REFRESH_TOKEN_COOKIE_EXPIRE_TIME = Number(process.env.REFRESH_TOKEN_COOKIE_EXPIRE_TIME);
const ACCESS_TOKEN_COOKIE_EXPIRE_TIME = Number(process.env.ACCESS_TOKEN_COOKIE_EXPIRE_TIME);
const NODE_ENV = process.env.NODE_ENV as string

export {
  CLIENT_URL,
  SENDGRID_API_KEY,
  DB_URL,
  PORT,
  IS_GITHUB_REPO,
  GITHUB_REPO_NAME,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_COOKIE_EXPIRE_TIME,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
  NODE_ENV
};
