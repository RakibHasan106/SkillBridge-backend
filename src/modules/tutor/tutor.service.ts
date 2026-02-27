import { prisma } from "../../lib/prisma";
import { TutorProfileWhereInput } from "../../../generated/prisma/models";

const createTutorProfile = async (data: any, userId: string) => {
  // prevent duplicate profile
  const existing = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Tutor profile already exists!");
  }

  return await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateTutorProfile = async (userId: string, data: any) => {
  const profile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
  });

  return await prisma.tutorProfile.update({
    where: { id: profile.id },
    data,
  });
};

const updateAvailability = async (userId: string, availability: any) => {
  const profile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
  });

  return await prisma.tutorProfile.update({
    where: { id: profile.id },
    data: {
      availability,
    },
  });
};

const getAllTutors = async ({
  search,
  categoryId,
  minPrice,
  maxPrice,
  rating,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: any) => {
  const andConditions: TutorProfileWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    });
  }

  if (rating !== undefined) {
    andConditions.push({
      averageRating: {
        gte: rating,
      },
    });
  }

  const tutors = await prisma.tutorProfile.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: true,
      category: true,
      reviews: true,
    },
  });

  const total = await prisma.tutorProfile.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: tutors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTutorById = async (tutorId: string) => {
  return await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: tutorId },
    include: {
      user: true,
      category: true,
      reviews: {
        include: {
          student: true,
        },
      },
    },
  });
};

const getMyTutorProfile = async (userId: string) => {
  return await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
    include: {
      user: true,
      category: true,
      reviews: true,
    },
  });
};

const getMyTeachingSessions = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
    select: { id: true },
  });

  return await prisma.booking.findMany({
    where: {
      tutorId: profile.id,
    },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const tutorService = {
  createTutorProfile,
  updateTutorProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getMyTutorProfile,
  getMyTeachingSessions,
};