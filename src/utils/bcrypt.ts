import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/env";

const hashPassword = async (password: string): Promise<string> => {
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return passwordHash;
};

const validatePassword = async (password: string, passwordToCompare: string): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, passwordToCompare);

  return isValid;
};

export { validatePassword, hashPassword };
