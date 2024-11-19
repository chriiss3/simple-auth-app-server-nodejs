import { Request, Response } from "express";
import User from "../user-model";

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

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.status(200).json({ users });
    console.log(User);
  } catch (err) {
    console.error(err);
  }
};

export { updatePassword, getUser, deleteAccount, empty, updateEmail, getUsers };
