import { Schema, model } from "mongoose";
import type { UserTypes } from "./interfaces/userInterfaces.js";

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
    refreshToken: {
      type: String,
      default: null,
    },
    sessionActive: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = model("User", UserSchema, "users");

export default User;
