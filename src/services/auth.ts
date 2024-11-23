import User from "../user-model.js";
import { ERROR_MESSAGES, ERROR_NAMES } from "../constants.js";
import { validatePassword } from "../utils/bcrypt.js";
import { MAILGUN_DOMAIN, EMAIL_SENDER } from "../config/env.js";
import type { UserTypes } from "../interfaces/user.js";
import { AppError, buildClientUrl, validateUser } from "../utils/index.js";
import mailgunClient from "../config/mailgun.js";

const saveUser = async (email: string, password: string, name: string): Promise<UserTypes> => {
  await validateUser(email, null, ERROR_MESSAGES.accountAlreadyExists);

  const newUser = new User({
    email,
    password,
    name,
  });

  const userSaved = await newUser.save();

  return userSaved;
};

const setActiveSession = async (token: string, userId: string): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.userNotFound, "");

  await User.findByIdAndUpdate(user.id, { refreshToken: token }, { new: true });
  await User.findByIdAndUpdate(user.id, { sessionActive: true }, { new: true });
};

const removeActiveSession = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(ERROR_NAMES.notFound, ERROR_MESSAGES.userNotFound, "");

  await User.findByIdAndUpdate(user.id, { refreshToken: null }, { new: true });
  await User.findByIdAndUpdate(user.id, { sessionActive: false }, { new: true });
};

const validateCredentials = async (email: string, password: string): Promise<UserTypes> => {
  const user = await validateUser(email, null, ERROR_MESSAGES.accountNotFound);

  const isMatch = await validatePassword(password, user.password);

  if (!isMatch) throw new AppError(ERROR_NAMES.badRequest, ERROR_MESSAGES.incorrectPassword, "");

  return user;
};

const sendResetEmail = async (token: string, email: string): Promise<void> => {
  const clientUrl = buildClientUrl();

  const resetUrl = `${clientUrl}/reset-password.html?token=${token}`;

  const emailOptions = {
    from: EMAIL_SENDER,
    to: email,
    subject: "Restablecer contraseña",
    html: `
      <h1>Restablece tu contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p>Este enlace es válido por 1 hora.</p>
    `,
  };

  await mailgunClient.messages.create(MAILGUN_DOMAIN, emailOptions);
};

const resetUserPassword = async (newPassword: string): Promise<void> => {
  await User.findByIdAndUpdate({ password: newPassword }, { new: true });
};

export { resetUserPassword, saveUser, setActiveSession, removeActiveSession, validateCredentials, sendResetEmail };
