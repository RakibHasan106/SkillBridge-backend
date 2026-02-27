import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized!");
    }

    const result = await tutorService.createTutorProfile(req.body, user.id);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const updateTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized!");
    }

    const result = await tutorService.updateTutorProfile(user.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized!");
    }

    const result = await tutorService.updateAvailability(user.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, minPrice, maxPrice, rating } = req.query;

    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await tutorService.getAllTutors({
      search: typeof search === "string" ? search : undefined,
      categoryId: categoryId as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch tutors",
      details: e,
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch tutor",
      details: e,
    });
  }
};

const getMyTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized!");

    const result = await tutorService.getMyTutorProfile(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch profile",
      details: e,
    });
  }
};

const getMyTeachingSessions = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized!");

    const result = await tutorService.getMyTeachingSessions(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch sessions",
      details: e,
    });
  }
};

export const tutorController = {
  createTutorProfile,
  updateTutorProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getMyTutorProfile,
  getMyTeachingSessions,
};
