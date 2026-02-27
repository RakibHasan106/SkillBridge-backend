import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const { search } = req.query;

    const result = await categoryService.getAllCategories({
      search: search as string | undefined,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch categories",
      details: e,
    });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.getCategoryById(categoryId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch category",
      details: e,
    });
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized!");

    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(categoryId, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to update category",
      details: e,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    await categoryService.deleteCategory(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (e) {
    res.status(400).json({
      error: "Failed to delete category",
      details: e,
    });
  }
};

export const CategoryController = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};