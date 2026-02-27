import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();


// Create booking
router.post(
  "/",
  auth(UserRole.STUDENT),
  bookingController.createBooking
);

// Get my bookings (student)
router.get(
  "/my-bookings",
  auth(UserRole.STUDENT),
  bookingController.getMyBookings
);

// Cancel booking (student)
router.patch(
  "/:bookingId/cancel",
  auth(UserRole.STUDENT),
  bookingController.cancelBooking
);

// ---------------- TUTOR ----------------

// View teaching sessions
router.get(
  "/tutor/sessions",
  auth(UserRole.TUTOR),
  bookingController.getTutorBookings
);

// Mark session as completed
router.patch(
  "/:bookingId/complete",
  auth(UserRole.TUTOR),
  bookingController.completeBooking
);

// ---------------- ADMIN ----------------

// Get all bookings
router.get(
  "/",
  auth(UserRole.ADMIN),
  bookingController.getAllBookings
);

// ---------------- SHARED ----------------

// Get single booking (owner / tutor / admin)
router.get(
  "/:bookingId",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  bookingController.getBookingById
);

export default router;