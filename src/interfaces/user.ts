import { Date } from "mongoose";

interface UserTypes {
  email: string;
  password: string;
  name: string;
  refreshToken: string | null;
  sessionActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

interface UserPayloadTypes {
  id: string;
  iat: number;
  exp: number;
}

export { UserTypes, UserPayloadTypes };
