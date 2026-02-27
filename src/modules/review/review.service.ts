import { prisma } from "../../lib/prisma";
import { BookingStatus, Role } from "../../../generated/prisma/client";

// ---------------- CREATE REVIEW ----------------
const createReview = async (
  data: { bookingId: string; rating: number; comment?: string },
  studentId: string
) => {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: data.bookingId },
  });

  if (booking.studentId !== studentId) {
    throw new Error("Unauthorized!");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can only review completed sessions!");
  }

  // prevent duplicate review (bookingId is unique in schema)
  const existingReview = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });

  if (existingReview) {
    throw new Error("Review already submitted for this booking!");
  }

  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      studentId,
      tutorId: booking.tutorId,
      bookingId: data.bookingId,
    },
  });
};

// ---------------- PUBLIC TUTOR REVIEWS ----------------
const getReviewsByTutor = async ({
  tutorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const data = await prisma.review.findMany({
    where: { tutorId },
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      student: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  const total = await prisma.review.count({
    where: { tutorId },
  });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ---------------- TUTOR REVIEWS ----------------
const getTutorReviews = async (userId: string) => {
  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
  });

  return prisma.review.findMany({
    where: { tutorId: tutor.id },
    include: {
      student: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ---------------- ADMIN ----------------
const getAllReviews = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const data = await prisma.review.findMany({
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      student: true,
      tutor: {
        include: {
          user: true,
        },
      },
    },
  });

  const total = await prisma.review.count();

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ---------------- GET SINGLE REVIEW ----------------
const getReviewById = async (
  reviewId: string,
  userId: string,
  role: Role
) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
    include: {
      student: true,
      tutor: {
        include: { user: true },
      },
    },
  });

  if (role === Role.ADMIN) return review;

  if (role === Role.STUDENT && review.studentId !== userId) {
    throw new Error("Unauthorized!");
  }

  if (role === Role.TUTOR) {
    const tutor = await prisma.tutorProfile.findUniqueOrThrow({
      where: { userId },
    });

    if (review.tutorId !== tutor.id) {
      throw new Error("Unauthorized!");
    }
  }

  return review;
};

export const reviewService = {
  createReview,
  getReviewsByTutor,
  getTutorReviews,
  getAllReviews,
  getReviewById,
};