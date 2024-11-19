import { config } from "dotenv";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";

config({ path: envFile });

const CLIENT_URL = process.env.CLIENT_URL as string;
const PORT = Number(process.env.PORT);

const MONGODB_URL = process.env.MONGODB_URL as string;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN as string;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY as string;
const MAILGUN_USERNAME = process.env.MAILGUN_USERNAME as string

//
const IS_GITHUB_REPO = process.env.IS_GITHUB_REPO as string;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME as string;

const REFRESH_TOKEN_EXPIRE_TIME = Number(process.env.REFRESH_TOKEN_EXPIRE_TIME);
const ACCESS_TOKEN_EXPIRE_TIME = Number(process.env.ACCESS_TOKEN_EXPIRE_TIME);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME as string;
const AUTH_COOKIE_EXPIRE_TIME = process.env.AUTH_COOKIE_EXPIRE_TIME as string;

const EMAIL_SENDER = process.env.EMAIL_SENDER as string;

const NODE_ENV = process.env.NODE_ENV as string;

export {
  CLIENT_URL,
  EMAIL_SENDER,
  PORT,
  MONGODB_URL,
  IS_GITHUB_REPO,
  GITHUB_REPO_NAME,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_EXPIRE_TIME,
  MAILGUN_USERNAME,
  ACCESS_TOKEN_EXPIRE_TIME,
  AUTH_COOKIE_NAME,
  NODE_ENV,
  MAILGUN_DOMAIN,
  MAILGUN_API_KEY,
  AUTH_COOKIE_EXPIRE_TIME
};
