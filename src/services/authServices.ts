import User from "../userModel.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
import { generateAccessToken, validateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import {
  IS_GITHUB_REPO,
  CLIENT_URL,
  GITHUB_REPO_NAME,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
} from "../config/env.js";
import sgMail from "@sendgrid/mail";
import { UserTypes } from "../interfaces/userInterfaces.js";
import AppError from "../utils/customError.js";

const registerUser = async (email: string, password: string, name: string): Promise<UserTypes> => {
  const userFound = await User.findOne({ email });

  if (userFound) throw new AppError("Bad Request", CLIENT_ERROR_MESSAGES.accountAlreadyExists, "register");

  const passwordHash = await hashPassword(password, 10);

  const newUser = new User({
    email,
    password: passwordHash,
    name,
  });

  const userSaved = await newUser.save();

  return userSaved;
};

const loginUser = async (email: string, password: string): Promise<UserTypes> => {
  let userUpdated;

  const userFound = await User.findOne({ email });

  if (!userFound) throw new AppError("Not Found", CLIENT_ERROR_MESSAGES.accountNotFound, "login");

  const isMatch = await validatePassword(password, userFound.password);

  if (!isMatch) throw new AppError("Bad Request", CLIENT_ERROR_MESSAGES.incorrectPassword, "login");

  const refreshToken = await generateRefreshToken({ id: userFound._id }, JWT_REFRESH_SECRET_KEY);

  // Menajear si ya existe un token de actualizacion en la cuenta del usuario
  userUpdated = await User.findByIdAndUpdate(userFound.id, { refreshToken: refreshToken }, { new: true });
  userUpdated = await User.findByIdAndUpdate(userFound.id, { sessionActive: true }, { new: true });

  return userUpdated;
};

// const validateUser = async (email: string, password: string): Promise<UserTypes> => {
//   const userFound = await User.findOne({ email });

//   if (!userFound) throw new AppError("Not Found", CLIENT_ERROR_MESSAGES.accountNotFound, "login");

//   const isMatch = await validatePassword(password, userFound.password);

//   if (!isMatch) throw new AppError("Bad Request", CLIENT_ERROR_MESSAGES.incorrectPassword, "login");

//   return userFound;
// };

const sendResetLink = async (email: string) => {
  let resetLink: string;

  const userFound = await User.findOne({ email });

  if (!userFound) throw new AppError("Not Found", CLIENT_ERROR_MESSAGES.accountNotFound, "forgotPassword");

  const accessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

  if (IS_GITHUB_REPO) {
    resetLink = `${CLIENT_URL}/${GITHUB_REPO_NAME}/reset-password.html?token=${accessToken}`;
  } else {
    resetLink = `${CLIENT_URL}/reset-password.html?token=${accessToken}`;
  }

  const msg = {
    to: email,
    from: "christiandolores003@outlook.com",
    subject: "Restablecer contraseña",
    html: `
      <h1>Restablece tu contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Este enlace es válido por 1 hora.</p>
    `,
  };

  await sgMail.send(msg);
};

const resetUserPassword = async (heeaderToken: string, newPassword: string): Promise<UserTypes> => {
  const decoded = await validateAccessToken(heeaderToken, JWT_ACCESS_SECRET_KEY);

  const userFound = await User.findById(decoded.id);

  if (!userFound) throw new AppError("Not Found", CLIENT_ERROR_MESSAGES.accountNotFound, "resetPassword");

  const isMatch = await validatePassword(newPassword, userFound.password);

  if (isMatch) throw new AppError("Bad Request", CLIENT_ERROR_MESSAGES.passwordIsMatch, "resetPassword");

  const passwordHash = await hashPassword(newPassword, 10);

  const userReset = (await User.findByIdAndUpdate(decoded.id, { password: passwordHash }, { new: true })) as UserTypes;

  return userReset;
};

export { registerUser, sendResetLink, resetUserPassword, loginUser };
