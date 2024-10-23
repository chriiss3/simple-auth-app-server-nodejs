import bcrypt from "bcrypt";
const hashPassword = async (password, saltRounds) => {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
};
const validatePassword = async (password, userPassword) => {
    const isValid = await bcrypt.compare(password, userPassword);
    return isValid;
};
export { validatePassword, hashPassword };
