import bcrypt from "bcrypt";

const hashPassword = async (password: string, saltRounds: number) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return passwordHash;
};

const validatePassword = async (password: string, userPassword: string) => {
  const isValid = await bcrypt.compare(password, userPassword);

  return isValid;
};

export { validatePassword, hashPassword };
