import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

// ---------------- STUDENT ----------------

// Create review
router.post(
  "/",
  auth(UserRole.STUDENT),
  ReviewController.createReview
);

// ---------------- PUBLIC ----------------

// Get reviews by tutor (public)
router.get(
  "/tutor/:tutorId",
  ReviewController.getReviewsByTutor
);

// ---------------- TUTOR ----------------

// Get my reviews
router.get(
  "/my-reviews",
  auth(UserRole.TUTOR),
  ReviewController.getMyReviews
);

// ---------------- ADMIN ----------------

// Get all reviews
router.get(
  "/",
  auth(UserRole.ADMIN),
  ReviewController.getAllReviews
);

// ---------------- SHARED ----------------

// Get single review
router.get(
  "/:reviewId",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  ReviewController.getReviewById
);

export default router;