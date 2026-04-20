import { Content } from "../models/content.model.js";
import { Group } from "../models/group.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/errorHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";

const getContent = asyncHandler(async (req, res) => {
  let user = req?.user;

  const filter =
    user?.role === "admin"
      ? {}
      : { $or: [{ group: null }, { group: user.group }] };

  const content = await Content.find(filter)
    .populate("group")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { content }, "Content fetched succesfully"));
});

const createContent = asyncHandler(async (req, res) => {
  const { title, body, type, groupId } = req.body;

  if (groupId) {
    const group = await Group.findById(groupId);
    if (!group) throw new ApiError(404, "Group not found");
  }

  const content = await Content.create({
    title,
    body,
    type: type || "text",
    group: groupId || null,
  });
  
  const populatedContent = await content.populate("group");

  return res
    .status(200)
    .json(new ApiResponse(200, { content: populatedContent }, "Content created"));
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
      ...(groupId !== undefined && { group: groupId }),
    },
    { new: true, runValidators: true },
  ).populate("group");

  if (!content) throw new ApiError(409, "Content not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { content }, "Content updated"));
});

const deleteContent = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const content = await Content.findByIdAndDelete(id);

  if (!content) throw new ApiError(409, "Content not found");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Content deleted successfully"));
});

export { getContent, createContent, updateContent, deleteContent };