import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { argon2d, argon2id } from "argon2";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access Tokens",
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, masterPassword } = req.body;
  if ([userName, email, masterPassword].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All Fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "Email or UserName Already exists");
  }
  const hashedPassword = await argon2id.hash(masterPassword);
  const user = await User.create({
    userName,
    email,
    masterPassword: hashedPassword,
  });
  const createdUser = await User.findById(user._id).select(
    "-MasterPassword -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {});
const logoutUser = asyncHandler(async (req, res) => {});
const refreshAccessToken = asyncHandler(async (req, res) => {});
const changeMasterPassword = asyncHandler(async (req, res) => {});
const updateAccountDetails = asyncHandler(async (req, res) => {});
const getCurrentUser = asyncHandler(async (req, res) => {});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeMasterPassword,
  updateAccountDetails,
  getCurrentUser,
};
