import {
  getAllUsers,
  createUser,
  assignUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { isLoggedIn } from "../utils/isLoggedIn.util.js";
import { validRoles } from "../utils/validRoles.util.js";

const router = Router();

router.use(isLoggedIn);

router
  .route("/")
  .get(validRoles("admin"), getAllUsers)
  .post(validRoles("admin"), createUser);

router.route("/:id/group").patch(validRoles("admin"), assignUser);

router.route("/:id").delete(validRoles("admin"), deleteUser);

module.exports = router;
