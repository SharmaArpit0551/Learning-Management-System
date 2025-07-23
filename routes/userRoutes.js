import {
  registerController,
  loginContoller,
  logoutController,
  getUserProfileController,
  updateUserController,
} from "../controllers/userController.js";
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginContoller);
router.get("/logout", logoutController);
router.get("/profile", isAuthenticated, getUserProfileController);
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUserController
);

export default router;
