import { Schema, model } from "mongoose";
import type { UserTypes } from "./userInterfaces.js";

const UserSchema = new Schema<UserTypes>(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = model("User", UserSchema, "users");

export default User;
