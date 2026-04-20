import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";

const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({})
    .populate("members")
    .sort({ createdAt: -1 });
  if (!groups) return new ApiError(404, "No group found");

  return res
    .status(200)
    .json(new ApiResponse(200, { groups }, "Groups fetched successfully"));
});

const createGroup = asyncHandler(async (req, res) => {
  const { groupName, description } = req.body;

  if (!groupName) return new ApiError(400, "Group name is required");

  const existingGroup = await Group.findOne({ groupName });
  if (existingGroup) return new ApiError(409, "Group already exists");

  const group = await Group.create({ name, description: description || "" });
  return res
    .status(200)
    .json(new ApiResponse(200, { group }, "Group created successfully"));
});

const updateGroup = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const group = await Group.findByIdAndUpdate(
    req.params.id,
    {
      ...(name && { name }),
      ...(description !== undefined && { description }),
    },
    { new: true, runValidators: true },
  );

  if (!group) return new ApiError(404, "Group not found");

  return res.status(200).json(new ApiResponse(200, { group }, "Group updated"));
});

const deleteGroup = asyncHandler(async (req, res) => {
  let { id } = req.params;

  const group = await Group.findByIdAndDelete(id);
  if (!group) return new ApiError(404, "Group not found!");

  await User.updateMany({ groupId: id }, { groupId: null });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group deleted and members unassigned"));
});

export { getAllGroups, createGroup, deleteGroup, updateGroup };
