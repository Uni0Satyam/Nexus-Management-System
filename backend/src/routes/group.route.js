import { Router } from "express";
import { isLoggedIn } from "../utils/isLoggedIn.util.js";
import { validRoles } from "../utils/validRoles.util.js";
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  updateGroup,
} from "../controllers/group.controller.js";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(getAllGroups).post(validRoles("admin"), createGroup);

router
  .route("/:id")
  .put(validRoles("admin"), updateGroup)
  .delete(validRoles("admin"), deleteGroup);

export default router;