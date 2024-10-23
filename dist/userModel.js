import { Schema, model } from "mongoose";
const UserSchema = new Schema({
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
}, {
    versionKey: false,
    timestamps: true,
});
const User = model("User", UserSchema, "users");
export default User;
