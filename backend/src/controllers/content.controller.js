import Content from "../models/content.model.js";
import Group from "../models/group.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";

const getContent = asyncHandler(async (req, res) => {
  let user = req?.user;

  const filter =
    user?.role === "admin"
      ? {}
      : { $or: [{ groupId: null }, { groupId: user.groupId }] };

  const content = await Content.find(filter)
    .populate("groupId")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { content }, "Content fetched succesfully"));
});

const createContent = asyncHandler(async (req, res) => {
  let { title, body, type, groupId } = req.body;

  if (groupId) {
    const group = await Group.findById(groupId);
    if (!group) return new ApiError(200, "Group not found");
  }

  const content = await Content.create({
    title,
    body,
    type: type || "text",
    groupId: groupId || null,
  });
  content = await content.populate("groupId");

  return res
    .status(200)
    .json(new ApiResponse(200, { content }, "Content created"));
});

const updateContent = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  let { title, body, type, groupId } = req.body;

  const content = await Content.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(body && { body }),
      ...(type && { type }),
      ...(groupId !== undefined && { groupId }),
    },
    { new: true, runValidators: true },
  ).populate("groupId");

  if (!content) return new ApiError(409, "Content not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { content }, "Content updated"));
});

const deleteContent = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const content = await Content.findByIdAndDelete(id);

  if (!content) return new ApiError(409, "Content not found");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Content deleted successfully"));
});

export { getContent, createContent, updateContent, deleteContent };