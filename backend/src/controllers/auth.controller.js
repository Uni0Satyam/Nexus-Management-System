import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { User } from "../models/user.model.js";

const cookiesOptions = {
  httpOnly: true,
  secure: false,
};

const getUserAccessToken = async (userId) => {
  const user = await User.findById(userId);
  return user.generateAccessToken();
};

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!name?.trim()) throw new ApiError(400, "Name is required");
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");

  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw new ApiError(409, "User with given email or username already exist");

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

  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User doesn't exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, "Password incorrect");

  const accessToken = await getUserAccessToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("group");
  if (!user) throw new ApiError(400, "User doesn't exist");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User details fetched successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};
