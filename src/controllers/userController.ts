import { Request, Response } from "express";

const updatePassword = async (req: Request, res: Response) => {
  res.send("Password updated!");
};

const getUserData = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export { updatePassword, getUserData };
