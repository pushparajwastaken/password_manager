import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    masterPassword: {
      type: String,
      select: false,
      required: [true, "Master Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("masterPassword")) return next();
  this.masterPassword = await argon2.hash(this.masterPassword);
  next();
});
userSchema.methods.isPasswordCorrect = async function (masterPassword) {
  return await argon2.verify(this.masterPassword, masterPassword);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
