import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookieOption.utils.js";
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
  if ([userName, email, masterPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "Email or UserName Already exists");
  }

  const user = await User.create({
    userName,
    email,
    masterPassword,
  });
  const createdUser = await User.findById(user._id).select(
    "-masterPassword -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }
  const user = await User.findOne({
    email,
  }).select("+masterPassword");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-masterPassword -refreshToken",
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken.trim(),
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id).select("+refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(401, "Refresh token expired or reused");
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id,
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { refreshToken, accessToken },
          "Refresh token refreshed succssfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});
const changeMasterPassword = asyncHandler(async (req, res) => {
  const { masterPassword, newPassword, confirmPassword } = req.body;
  if (
    [newPassword, confirmPassword].some(
      (f) => typeof f !== "string" || f.trim() === "",
    )
  ) {
    throw new ApiError(400, "Both the fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Both the password should be same");
  }
  const user = await User.findById(req.user._id).select("+masterPassword");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(masterPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(403, "Incorrect current password");
  }
  user.masterPassword = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Updated Successfully"));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userName, email } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "Atleast one field is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { userName, email: email },
    },
    {
      new: true,
    },
  ).select("-masterPassword ");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeMasterPassword,
  updateAccountDetails,
  getCurrentUser,
};
