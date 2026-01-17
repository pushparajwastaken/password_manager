import { Password } from "../models/password.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { deriveKey, encrypt, decrypt } from "../utils/crypto.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
  return res
    .status(200)
    .json(new ApiResponse(200, savedPassword, "Password Saved Successfully"));
});
export const updatePassword = asyncHandler(async (req, res) => {});
export const deletePassword = asyncHandler(async (req, res) => {});
export const getAllUserPasswords = asyncHandler(async (req, res) => {
  const passwords = await Password.find({
    owner: req.user._id,
  }).select("title website createdAt updatedAt");
  if (!passwords) {
    throw new ApiError(404, "No passwords found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, passwords, "Passwords fetched successfully"));
});
