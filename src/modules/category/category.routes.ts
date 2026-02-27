import { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

// ---------- Public Routes ----------
router.get(
  "/",
  categoryController.getAllCategories
);

router.get(
  "/:categoryId",
  categoryController.getCategoryById
);

// ---------- Admin Routes ----------
router.post(
  "/",
  auth(UserRole.ADMIN),
  categoryController.createCategory
);

router.put(
  "/:categoryId",
  auth(UserRole.ADMIN),
  categoryController.updateCategory
);

router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  categoryController.deleteCategory
);

export default router;