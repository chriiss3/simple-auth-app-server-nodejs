const CLIENT_SUCCES_MESSAGES = {
  loginSuccess: "Sesión iniciada",
  registerSuccess: "Cuenta creada",
  linkSent: "Enlace enviado",
  passwordResetSuccess: "Contraseña restablecida",
  logoutSuccess: "Sesion cerrada",
};

const CLIENT_ERROR_MESSAGES = {
  invalidMail: "Correo invalido.",
  accountAlreadyExists: "Esta cuenta ya existe.",
  userNotFound: "Este usuario no existe.",
  incorrectPassword: "Contraseña incorrecta.",
  accountNotFound: "Esta cuenta no existe.",
  passwordIsMatch: "Esta contraseña ya esta en uso.",
  invalidPasswordLength: "Longitud de contraseña inválida.",
  unknownError: "Error desconocido en el servidor.",
  invalidData: "Datos invalidos.",
  authError: "Error de autenticacion.",
  expiredSession: "Sesion expirada, porfavor vuelve a iniciar sesion",
  passwordNotMath: "Las contraseñas no coinciden.",
  emailFieldRequired: "El campo de email es obligatorio",
  passwordFieldRequired: "El campo de contraseña es obligatorio",
  nameFieldRequired: "El campo de nombre es obligatorio",
  newPasswordFieldRequired: "El campo de nueva contraseña es obligatorio",
  confirmNewPasswordFieldRequired: "El campo de confirmacion de nueva contraseña es obligatorio",
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

export { CLIENT_SUCCES_MESSAGES, CLIENT_ERROR_MESSAGES, JWT_ERROR_MESSAGES, MONGOOSE_ERROR_MESSAGES };
