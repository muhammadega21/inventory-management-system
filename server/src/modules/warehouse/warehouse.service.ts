import { generateWarehouseCode } from "../../common/utils/generateCode.util.js";
import { paginationMeta } from "../../common/utils/helper.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "./warehouse.schema.js";

export const WarehouseSelect = {
  id: true,
  code: true,
  name: true,
  city: true,
  address: true,
  description: true,
  // capacity: true,
  // capacityUnit: true,
  is_active: true,
};

const getPaginatedWarehouses = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };

  const [warehouse, total] = await Promise.all([
    prisma.warehouse.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: WarehouseSelect,
    }),
    prisma.warehouse.count({ where }),
  ]);

  return {
    data: warehouse,
    meta: paginationMeta(total, page, limit),
  };
};

export const WarehouseService = {
  async findAllWarehouses(query: {
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
          code: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    return getPaginatedWarehouses(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findWarehouseById(id: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      select: WarehouseSelect,
    });

    if (!warehouse) {
      throw createError("Warehouse not found", 404);
    }

    return warehouse;
  },

  async createWarehouse(data: CreateWarehouseInput) {
    const code = await generateWarehouseCode();
    const duplicateWarehouse = await prisma.warehouse.findUnique({
      where: { code },
      select: { id: true },
    });

    if (duplicateWarehouse) {
      throw createError("Code already exists", 400);
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        code,
        city: data.city,
        address: data.address,
        description: data.description,
        // capacity: data.capacity,
        // capacityUnit: data.capacityUnit,
        is_active: data.is_active,
      },
      select: WarehouseSelect,
    });

    return warehouse;
  },
  async updateWarehouse(id: number, data: UpdateWarehouseInput) {
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existingWarehouse) {
      throw createError("Warehouse not found", 404);
    }

    return prisma.warehouse.update({
      where: { id },
      data: { ...data },
      select: WarehouseSelect,
    });
  },

  async deleteWarehouse(id: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!warehouse) {
      throw createError("Warehouse not found", 404);
    }

    const inventory = await prisma.inventory.findFirst({
      where: {
        productId: id,
        quantity: {
          gt: 0,
        },
      },
    });

    if (inventory) {
      throw createError(
        "Cannot deactivate warehouse while stock still exists",
        400,
      );
    }

    return prisma.warehouse.update({
      where: { id },
      data: { is_active: false },
      select: WarehouseSelect,
    });
  },
};
