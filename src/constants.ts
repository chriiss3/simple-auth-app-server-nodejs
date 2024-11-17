const CLIENT_SUCCES_MESSAGES = {
  loginSuccess: "Sesión iniciada",
  registerSuccess: "Cuenta creada",
  linkSent: "Enlace enviado",
  passwordResetSuccess: "Contraseña restablecida",
  logoutSuccess: "Sesion cerrada",
};

const CLIENT_ERROR_MESSAGES = {
  // Unauthorized
  expiredResetLink: "Enlace de restablecimiento de contraseña expirado",
  authError: "Error de autenticación, vuelve a iniciar sesion",
  sessionExpired: "Sesion expirada, vuelve a iniciar sesion",
  // Not Found
  userNotFound: "Usuario no encontrado",
  accountNotFound: "Esta cuenta no existe.",
  // Server Error
  internalServerError: "Error desconocido en el servidor",
  // Bad Request
  accountAlreadyExists: "Esta cuenta ya existe.",
  incorrectPassword: "Contraseña incorrecta.",
  passwordIsMatch: "Esta contraseña ya esta en uso.",
  invalidPasswordLength: "Longitud de contraseña inválida.",
  invalidData: "Datos invalidos.",
  passwordNotMath: "Las contraseñas no coinciden.",
  emailFieldRequired: "El campo de email es obligatorio",
  passwordFieldRequired: "El campo de contraseña es obligatorio",
  nameFieldRequired: "El campo de nombre es obligatorio",
  newPasswordFieldRequired: "El campo de nueva contraseña es obligatorio",
  confirmNewPasswordFieldRequired: "El campo de confirmacion de nueva contraseña es obligatorio",
};

const ERROR_MESSAGES = {
  // Unauthorized
  invalidToken: "Invalid token",
  // Not Found
  refreshTokenNotFound: "Refresh token not found",
  userNotFound: "User not found",
  accountNotFound: "Account not found",
  // Bad Request
  invalidMail: "Invalid mail",
  accountAlreadyExists: "Account already exists",
  incorrectPassword: "incorrect password",
  passwordIsMatch: "Password is match",
  invalidPasswordLength: "Invalid password length",
  invalidData: "Invalid data",
  passwordNotMath: "Password not math",
  // Server Error
  internalServerError: "internal Server Error",
};

const ERROR_NAMES = {
  badRequest: "Bad Request",
  Unauthorized: "Unauthorized",
  Forbidden: "Forbidden",
  notFound: "Not Found",
  serverError: "Server Error",
};

const MONGOOSE_ERROR_MESSAGES = [
  "DocumentNotFoundError",
  "DivergentArrayError",
  "MissingSchemaError",
  "DisconnectedError",
  "StrictModeError",
  "ValidatorError",
  "ValidationError",
  "CastError",
  "SyncIndexesError",
  "OverwriteModelError",
  "ParallelSaveError",
  "MongooseServerSelectionError",
];

const JWT_ERROR_MESSAGES = [
  "jwt must be provided",
  "invalid token",
  "jwt malformed",
  "invalid signature",
  "jwt signature is required",
  "jwt audience invalid. expected: [aud]",
  "jwt issuer invalid. expected: [iss]",
  "jwt id invalid",
  "jwt subject invalid",
  "jwt algorithm invalid",
  "jwt not active",
  "jwt not before",
  "jwt audience invalid",
  "jwt issuer invalid",
  "secret or public key must be provided",
];

export {
  CLIENT_SUCCES_MESSAGES,
  ERROR_MESSAGES,
  JWT_ERROR_MESSAGES,
  MONGOOSE_ERROR_MESSAGES,
  ERROR_NAMES,
  CLIENT_ERROR_MESSAGES,
};
