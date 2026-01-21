import { Password } from "../models/password.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deriveKey, encrypt, decrypt } from "../utils/crypto.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { isValidObjectId } from "mongoose";
export const CreatePassword = asyncHandler(async (req, res) => {
  const { password, title, website, masterPassword } = req.body;
  if ([password, title, masterPassword].some((f) => !f?.trim())) {
    throw new ApiError(400, "Password, title and master password are required");
  }

  const user = await User.findById(req.user._id).select("+masterPassword");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if ([password, title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Password and Title are required");
  }

  const isValid = await user.isPasswordCorrect(masterPassword);
  if (!isValid) {
    throw new ApiError(401, "Invalid master password");
  }
  const key = deriveKey(masterPassword, user.salt);
  const { cipherText, iv, authTag } = encrypt(password, key);
  const savedPassword = await Password.create({
    owner: user._id,
    encryptedPassword: cipherText,
    title,
    website,
    iv,
    authTag,
  });
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: savedPassword._id,
        title,
        website,
        createdAt: savedPassword.createdAt,
      },
      "Password saved successfully",
    ),
  );
});
export const updatePassword = asyncHandler(async (req, res) => {
  const { passwordId, newPassword, masterPassword, title, website } = req.body;
  if (isValidObjectId(passwordId)) {
    throw new ApiError(400, "Invalid Password Id");
  }
  const password = await Password.findById(passwordId);
  if (!password) {
    throw new ApiError(404, "Password not found");
  }
  if (!password.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete the password");
  }

  const user = await User.findById(req.user._id).select(
    "+masterPassword +salt",
  );
  const isValid = await user.isPasswordCorrect(masterPassword);
  if (!isValid) {
    throw new ApiError(401, "Invalid master password");
  }

  const key = deriveKey(masterPassword, user.salt);
  const { cipherText, iv, authTag } = encrypt(newPassword, key);

  password.encryptedPassword = cipherText;
  password.iv = iv;
  password.authTag = authTag;

  await password.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});
export const deletePassword = asyncHandler(async (req, res) => {
  const { passwordId } = req.body;
  if (!isValidObjectId(passwordId)) {
    throw new ApiError(400, "Invalid Password Id");
  }
  const password = await Password.findById(passwordId);
  if (!password) {
    throw new ApiError(404, "Password not found");
  }
  if (!password.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete the password");
  }
  await password.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password deleted successfully"));
});
export const getAllUserPasswords = asyncHandler(async (req, res) => {
  const passwords = await Password.find({
    owner: req.user._id,
  }).select("title website createdAt updatedAt");
  if (passwords.length === 0) {
    throw new ApiError(404, "No passwords found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, passwords, "Passwords fetched successfully"));
});
