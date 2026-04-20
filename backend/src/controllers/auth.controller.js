import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const cookiesOptions = {
  httpOnly: true,
  secure: false,
};

const generateRefreshAndAccessToken = asyncHandler(async (userId) => {
  const user = await User.findById(userId);
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
});

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!name?.trim()) return new ApiError(400, "Name is required");
  if (!email?.trim()) return new ApiError(400, "Email is required");
  if (!password?.trim()) return new ApiError(400, "Password is required");

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return new ApiError(409, "User with given email or username already exist");

  const newUser = await User.create({
    name,
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email?.trim()) return new ApiError(400, "Email is required");
  if (!password?.trim()) return new ApiError(400, "Password is required");

  const user = await User.findOne({ email }).select("-refreshToken");
  if (!user) return new ApiError(404, "User doesn't exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, "Password incorrect");

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(200, { user }, "User logged in successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  return res
    .status(200)
    .clearCookies("refreshToken", cookieOptions)
    .clearCookies("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token expired");

    const { accessToken, newRefreshToken } =
      await generateRefreshAndAccessToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", newRefreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token Refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-refreshToken").populate("group");
  if (!user) return new ApiError(400, "User doesn't exist");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User details fetched successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
};
