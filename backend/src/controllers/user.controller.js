import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate("group").sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfull"));
});

const createUser = asyncHandler(async (req, res) => {
  let { name, email, password, role, group } = req.body;

  const user = await User.findOne({ email });
  if (user) return new ApiError(409, "User already registered");

  await user.create({
    name,
    email,
    password,
    role: role || "user",
    group: group || null,
  });

  res.status(200).json(new ApiResponse(200, {}, "User created successfull"));
});

const assignUser = asyncHandler(async (req, res) => {
  let { groupId } = req.body;
  let { id } = req.params;

  if (groupId) {
    const group = await Group.findById(groupId);
    if (!group) return new ApiError(404, "Group not found!");
  }

  let user = await User.findByIdAndUpdate(
    id,
    {
      groupId: groupId || null,
    },
    { new: true },
  ).populate("groupId");
  if (!user) return new ApiError(404, "User not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Group assigned to the user"));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  let { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) return new ApiError(404, "User not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export { getAllUsers, createUser, assignUser, deleteUser };
