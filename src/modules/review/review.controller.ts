import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized!");

    const result = await reviewService.createReview(req.body, user.id);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const getReviewsByTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await reviewService.getReviewsByTutor({
      tutorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch reviews",
      details: e,
    });
  }
};

const getMyReviews = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await reviewService.getTutorReviews(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch reviews",
      details: e,
    });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await reviewService.getAllReviews({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch reviews",
      details: e,
    });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { reviewId } = req.params;

    const result = await reviewService.getReviewById(
      reviewId,
      user.id,
      user.role
    );

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch review",
      details: e,
    });
  }
};

export const ReviewController = {
  createReview,
  getReviewsByTutor,
  getMyReviews,
  getAllReviews,
  getReviewById,
};