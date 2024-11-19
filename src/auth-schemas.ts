import { z } from "zod";
import { CLIENT_ERROR_MESSAGES, ERROR_MESSAGES } from "./constants.js";

const registerSchema = z.object({
  name: z.string({ required_error: CLIENT_ERROR_MESSAGES.nameFieldRequired }),
  email: z
    .string({ required_error: CLIENT_ERROR_MESSAGES.emailFieldRequired })
    .email({ message: ERROR_MESSAGES.invalidMail }),
  password: z
    .string({ required_error: CLIENT_ERROR_MESSAGES.passwordFieldRequired })
    .min(8, { message: CLIENT_ERROR_MESSAGES.invalidPasswordLength }),
});

const loginSchema = z.object({
  email: z.string({ required_error: CLIENT_ERROR_MESSAGES.emailFieldRequired }),
  password: z.string({ required_error: CLIENT_ERROR_MESSAGES.passwordFieldRequired }),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: CLIENT_ERROR_MESSAGES.newPasswordFieldRequired })
      .min(8, { message: CLIENT_ERROR_MESSAGES.invalidPasswordLength }),

    confirmNewPassword: z.string({ required_error: CLIENT_ERROR_MESSAGES.confirmNewPasswordFieldRequired }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: CLIENT_ERROR_MESSAGES.passwordNotMath,
    path: ["confirmNewPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: CLIENT_ERROR_MESSAGES.emailFieldRequired })
    .email({ message: ERROR_MESSAGES.invalidMail }),
});

export { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema };
