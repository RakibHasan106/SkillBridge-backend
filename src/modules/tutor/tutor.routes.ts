import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

// ---------- Public Routes ----------
router.get(
  "/",
  tutorController.getAllTutors
);

router.get(
  "/:tutorId",
  tutorController.getTutorById
);

// ---------- Tutor Private Routes ----------
router.get(
  "/my-profile",
  auth(UserRole.TUTOR),
  tutorController.getMyTutorProfile
);

router.post(
  "/profile",
  auth(UserRole.TUTOR),
  tutorController.createTutorProfile
);

router.put(
  "/profile",
  auth(UserRole.TUTOR),
  tutorController.updateTutorProfile
);

router.put(
  "/availability",
  auth(UserRole.TUTOR),
  tutorController.updateAvailability
);

router.get(
  "/sessions",
  auth(UserRole.TUTOR),
  tutorController.getMyTeachingSessions
);

export default router;