import { paginationMeta } from "../../common/utils/helper.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema.js";

export const CategorySelect = {
  id: true,
  name: true,
  description: true,
  is_active: true,
  createdAt: true,
  updatedAt: true,
} as const;

const getPaginatedCategories = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: CategorySelect,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data: categories,
    meta: paginationMeta(total, page, limit),
  };
};

export const CategoryService = {
  async findAllCategories(query: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder: "asc" | "desc";
  }) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    return getPaginatedCategories(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      select: CategorySelect,
    });

    if (!category) {
      throw createError("Category not found", 404);
    }

    return category;
  },

  async createCategory(data: CreateCategoryInput) {
    const duplicateCategory = await prisma.category.findUnique({
      where: { name: data.name },
      select: { id: true },
    });

    if (duplicateCategory) {
      throw createError("Name already exists", 400);
    }

    return prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        is_active: data.is_active,
      },
      select: CategorySelect,
    });
  },

  async updateCategory(id: number, data: UpdateCategoryInput) {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existingCategory) {
      throw createError("Category not found", 404);
    }

    if (data.name !== undefined && data.name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { name: data.name },
        select: { id: true },
      });

      if (duplicateCategory) {
        throw createError("Name already exists", 409);
      }
    }

    return prisma.category.update({
      where: { id },
      data: { ...data },
      select: CategorySelect,
    });
  },

  async deleteCategory(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!category) {
      throw createError("Category not found", 404);
    }

    return prisma.category.update({
      where: { id },
      data: { is_active: false },
      select: CategorySelect,
    });
  },
};
