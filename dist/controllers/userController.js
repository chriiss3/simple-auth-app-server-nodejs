// import { UserTypes } from "../userInterfaces";
// interface CustomRequestTypes extends Request {
//   userData: UserTypes;
// }
const updatePassword = async (req, res) => {
    res.send("Password updated!");
};
const getUserData = async (req, res) => {
    console.log(req.user);
    res.status(200).json(req.user);
    // res.status(200).json({ userData: req.userData });
};
export { updatePassword, getUserData };
