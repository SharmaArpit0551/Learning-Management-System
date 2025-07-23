import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} from "../controllers/courseProgressController.js";

const router = express.Router();

router.get("/:courseId", isAuthenticated, getCourseProgress);
router.post(
  "/:courseId/lecture/:lectureId/view",
  isAuthenticated,
  updateLectureProgress
);
router.post("/:courseId/complete", isAuthenticated, markAsCompleted);
router.post("/:courseId/inComplete", isAuthenticated, markAsInCompleted);

export default router;
