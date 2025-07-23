import express from "express";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchase,
  stripeWebhook,
} from "../controllers/purchaseCourseController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  createCheckoutSession
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.get(
  "/course/:courseId/detail-with-status",
  isAuthenticated,
  getCourseDetailWithPurchase
);
router.get("/", getAllPurchasedCourse);
export default router;
