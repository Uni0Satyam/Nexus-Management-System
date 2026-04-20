import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";

const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({})
    .populate("members")
    .populate("contents")
    .sort({ createdAt: -1 });
  if (!groups) throw new ApiError(404, "No group found");

  return res
    .status(200)
    .json(new ApiResponse(200, { groups }, "Groups fetched successfully"));
});

const createGroup = asyncHandler(async (req, res) => {
  const { groupName, description } = req.body;

  if (!groupName) throw new ApiError(400, "Group name is required");

  const existingGroup = await Group.findOne({ groupName });
  if (existingGroup) throw new ApiError(409, "Group already exists");

  const group = await Group.create({ groupName, description: description || "" });
  return res
    .status(200)
    .json(new ApiResponse(200, { group }, "Group created successfully"));
});

const updateGroup = asyncHandler(async (req, res, next) => {
  const { groupName, description } = req.body;

  const group = await Group.findByIdAndUpdate(
    req.params.id,
    {
      ...(groupName && { groupName }),
      ...(description !== undefined && { description }),
    },
    { new: true, runValidators: true },
  );

  if (!group) throw new ApiError(404, "Group not found");

  return res.status(200).json(new ApiResponse(200, { group }, "Group updated"));
});

const deleteGroup = asyncHandler(async (req, res) => {
  let { id } = req.params;

  const group = await Group.findByIdAndDelete(id);
  if (!group) throw new ApiError(404, "Group not found!");

  await User.updateMany({ group: id }, { group: null });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group deleted and members unassigned"));
});

export { getAllGroups, createGroup, deleteGroup, updateGroup };