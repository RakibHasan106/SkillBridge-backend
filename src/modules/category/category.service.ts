import { prisma } from "../../lib/prisma";

// ---------------- GET ALL CATEGORIES ----------------
const getAllCategories = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const data = await prisma.category.findMany({
    where,
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.category.count({ where });

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

// ---------------- GET CATEGORY BY ID ----------------
const getCategoryById = async (categoryId: string) => {
  return prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });
};

// ---------------- CREATE CATEGORY ----------------
const createCategory = async (data: {
  name: string;
  description?: string;
  icon?: string;
}) => {
  // prevent duplicate name
  const existing = await prisma.category.findFirst({
    where: { name: data.name },
  });
  if (existing) {
    throw new Error("Category with this name already exists");
  }

  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
    },
  });
};

// ---------------- UPDATE CATEGORY ----------------
const updateCategory = async (
  categoryId: string,
  data: { name?: string; description?: string; icon?: string }
) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  if (data.name && data.name !== category.name) {
    const existing = await prisma.category.findFirst({
      where: { name: data.name },
    });
    if (existing) {
      throw new Error("Category with this name already exists");
    }
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
    },
  });
};

// ---------------- DELETE CATEGORY ----------------
const deleteCategory = async (categoryId: string) => {
  await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });

  const tutorsUsing = await prisma.tutorProfile.count({
    where: { categoryId },
  });

  if (tutorsUsing > 0) {
    throw new Error(
      `Cannot delete category. ${tutorsUsing} tutor(s) are using this category`
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};