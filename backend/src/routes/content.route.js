import { Router } from "express";
import { isLoggedIn } from "../utils/isLoggedIn.util.js";
import { validRoles } from "../utils/validRoles.util.js";
import {
  createContent,
  deleteContent,
  getContent,
  updateContent,
} from "../controllers/content.controller.js";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(getContent).post(validRoles("admin"), createContent);

router
  .route("/:id")
  .put(validRoles("admin"), updateContent)
  .delete(validRoles("admin"), deleteContent);

export default router;