import { paginationMeta } from "../../common/utils/helper.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";

export const InventoriesSelect = {
  id: true,
  product: {
    select: {
      id: true,
      name: true,
      sku: true,
      minimum_stock: true,
      image: true,
      is_active: true,
    },
  },
  warehouse: {
    select: {
      id: true,
      name: true,
      code: true,
      is_active: true,
    },
  },
  quantity: true,
};

const getPaginatedInventories = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;
  let orderBy: any;

  switch (sortBy) {
    case "quantity":
      orderBy = { quantity: sortOrder };
      break;

    case "createdAt":
      orderBy = { createdAt: sortOrder };
      break;

    default:
      orderBy = { quantity: "asc" };
      break;
  }

  const [inventory, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: InventoriesSelect,
    }),
    prisma.inventory.count({ where }),
  ]);

  return {
    data: inventory,
    meta: paginationMeta(total, page, limit),
  };
};

export const InventoriyService = {
  async findAllInventories(query: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder: "asc" | "desc";
  }) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          product: {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
        {
          product: {
            sku: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
        {
          warehouse: {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    return getPaginatedInventories(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findInventoryById(id: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      select: InventoriesSelect,
    });

    if (!inventory) {
      throw createError("Inventory not found", 404);
    }

    return inventory;
  },
};
