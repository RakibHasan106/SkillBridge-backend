import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized!");

    const result = await bookingService.createBooking(req.body, user.id);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { status } = req.query;

    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await bookingService.getStudentBookings({
      studentId: user.id,
      status: status as any,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};

const getTutorBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await bookingService.getTutorBookings(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch sessions", details: e });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await bookingService.getAllBookings({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { bookingId } = req.params;

    const result = await bookingService.getBookingById(
      bookingId,
      user.id,
      user.role
    );

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch booking", details: e });
  }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { bookingId } = req.params;

    const result = await bookingService.cancelBooking(
      bookingId,
      user.id
    );

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const completeBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { bookingId } = req.params;

    const result = await bookingService.completeBooking(
      bookingId,
      user.id
    );

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const bookingController = {
  createBooking,
  getMyBookings,
  getTutorBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  completeBooking,
};