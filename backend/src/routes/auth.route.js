import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { isLoggedIn } from "../utils/isLoggedIn.util.js";

const router = Router();

router.route("/signUp").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(isLoggedIn, logoutUser);

router.route("/profile").get(isLoggedIn, getUserProfile);

export default router;