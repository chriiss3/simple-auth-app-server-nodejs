import { Date } from "mongoose";

interface UserTypes {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  _id: string;
  updatedAt: Date | undefined
}

interface TokenPayloadTypes {
  id: string;
  iat: number;
  exp: number;
}

export { UserTypes, TokenPayloadTypes };
