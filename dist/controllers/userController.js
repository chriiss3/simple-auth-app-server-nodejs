const updatePassword = async (req, res) => {
    res.send("Password updated!");
};
const getUserData = async (req, res) => {
    res.status(200).json(req.user);
};
export { updatePassword, getUserData };
