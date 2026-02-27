import { prisma } from "../../lib/prisma";
import { BookingStatus, Role } from "../../../generated/prisma/client";

// ---------------- CREATE BOOKING ----------------
const createBooking = async (
  data: { tutorId: string; date: Date },
  studentId: string
) => {
  await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: data.tutorId },
  });

  return await prisma.booking.create({
    data: {
      studentId,
      tutorId: data.tutorId,
      date: new Date(data.date),
    },
  });
};

// ---------------- STUDENT BOOKINGS ----------------
const getStudentBookings = async ({
  studentId,
  status,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const where: any = { studentId };
  if (status) where.status = status;

  const data = await prisma.booking.findMany({
    where,
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      tutor: {
        include: { user: true },
      },
    },
  });

  const total = await prisma.booking.count({ where });

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

// ---------------- TUTOR BOOKINGS ----------------
const getTutorBookings = async (userId: string) => {
  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
  });

  return prisma.booking.findMany({
    where: { tutorId: tutor.id },
    include: {
      student: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// ---------------- ADMIN ----------------
const getAllBookings = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const data = await prisma.booking.findMany({
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      student: true,
      tutor: { include: { user: true } },
    },
  });

  const total = await prisma.booking.count();

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

// ---------------- GET SINGLE BOOKING ----------------
const getBookingById = async (
  bookingId: string,
  userId: string,
  role: Role
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      student: true,
      tutor: { include: { user: true } },
    },
  });

  if (role === Role.ADMIN) return booking;

  if (role === Role.STUDENT && booking.studentId !== userId) {
    throw new Error("Unauthorized!");
  }

  if (role === Role.TUTOR) {
    const tutor = await prisma.tutorProfile.findUniqueOrThrow({
      where: { userId },
    });

    if (booking.tutorId !== tutor.id) {
      throw new Error("Unauthorized!");
    }
  }

  return booking;
};

// ---------------- CANCEL BOOKING ----------------
const cancelBooking = async (bookingId: string, studentId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.studentId !== studentId) {
    throw new Error("Unauthorized!");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("Only confirmed bookings can be cancelled!");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  });
};

// ---------------- COMPLETE BOOKING ----------------
const completeBooking = async (bookingId: string, tutorUserId: string) => {
  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId: tutorUserId },
  });

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.tutorId !== tutor.id) {
    throw new Error("Unauthorized!");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("Only confirmed bookings can be completed!");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.COMPLETED },
  });
};

export const bookingService = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  completeBooking,
};