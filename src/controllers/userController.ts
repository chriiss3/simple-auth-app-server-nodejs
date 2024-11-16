import { Request, Response } from "express";

const updatePassword = async (req: Request, res: Response) => {
  res.send("Password updated!");
};

const getUser = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

const deleteAccount = async (req: Request, res: Response) => {
  res.send("Account deleted!");
};

const empty = (req: Request, res: Response) => {
  res.sendStatus(200);
};

const updateEmail = async (req: Request, res: Response) => {
  res.send("Email updated!");
};

export { updatePassword, getUser, deleteAccount, empty, updateEmail };
