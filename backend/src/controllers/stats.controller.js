import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/responseHandler.util.js";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import { Content } from "../models/content.model.js";

const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalGroups, totalContent] = await Promise.all([
    User.countDocuments(),
    Group.countDocuments(),
    Content.countDocuments()
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { totalUsers, totalGroups, totalContent }, "Stats fetched successfully"));
});

export { getAdminStats };
