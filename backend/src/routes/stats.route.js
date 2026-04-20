import { Router } from "express";
import { getAdminStats } from "../controllers/stats.controller.js";
import { isLoggedIn } from "../utils/isLoggedIn.util.js";
import { validRoles } from "../utils/validRoles.util.js";

const router = Router();

router.use(isLoggedIn);

router.get("/", validRoles("admin"), getAdminStats);

export default router;
