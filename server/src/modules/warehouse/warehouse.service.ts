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

  const [warehouses, total] = await Promise.all([
    prisma.warehouse.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: WarehouseSelect,
    }),
    prisma.warehouse.count({ where }),
  ]);

  const warehouseIds = warehouses.map((warehouse) => warehouse.id);
  const inventories = warehouseIds.length
    ? await prisma.inventory.groupBy({
        by: ["warehouseId"],
        where: {
          warehouseId: { in: warehouseIds },
          product: { is_active: true },
        },
        _count: { _all: true },
        _sum: { quantity: true },
      })
    : [];

  const data = warehouses.map((warehouse) => {
    const inventory = inventories.find(
      (item) => item.warehouseId === warehouse.id,
    );

    return {
      ...warehouse,
      inventorySummary: {
        skuCount: inventory?._count._all ?? 0,
        totalQuantity: inventory?._sum.quantity ?? 0,
      },
    };
  });

  return {
    data,
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

  async getWarehouseSummary() {
    const [totalWarehouses, activeWarehouses, inactiveWarehouses, inventory] =
      await Promise.all([
        prisma.warehouse.count(),
        prisma.warehouse.count({ where: { is_active: true } }),
        prisma.warehouse.count({ where: { is_active: false } }),
        prisma.inventory.aggregate({
          where: {
            product: { is_active: true },
            warehouse: { is_active: true },
          },
          _count: { _all: true },
          _sum: { quantity: true },
        }),
      ]);

    return {
      totalWarehouses,
      activeWarehouses,
      inactiveWarehouses,
      skuLocationCount: inventory._count._all,
      totalQuantity: inventory._sum.quantity ?? 0,
    };
  },

  async findWarehouseById(id: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      select: WarehouseSelect,
    });

    if (!warehouse) {
      throw createError("Warehouse not found", 404);
    }

    const [inventorySummary, topProducts] = await Promise.all([
      prisma.inventory.aggregate({
        where: {
          warehouseId: id,
          product: { is_active: true },
        },
        _count: { _all: true },
        _sum: { quantity: true },
      }),
      prisma.inventory.findMany({
        where: {
          warehouseId: id,
          quantity: { gt: 0 },
          product: { is_active: true },
        },
        orderBy: { quantity: "desc" },
        take: 3,
        select: {
          quantity: true,
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              unit: true,
            },
          },
        },
      }),
    ]);

    return {
      ...warehouse,
      inventorySummary: {
        skuCount: inventorySummary._count._all,
        totalQuantity: inventorySummary._sum.quantity ?? 0,
      },
      topProducts: topProducts.map((inventory) => ({
        ...inventory.product,
        quantity: inventory.quantity,
      })),
    };
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
      select: { id: true, is_active: true },
    });

    if (!warehouse) {
      throw createError("Warehouse not found", 404);
    }

    if (warehouse.is_active) {
      const inventoryWithStock = await prisma.inventory.findFirst({
        where: {
          warehouseId: id,
          quantity: { gt: 0 },
        },
        select: { id: true },
      });

      if (inventoryWithStock) {
        throw createError(
          "Cannot deactivate warehouse while stock still exists",
          400,
        );
      }
    }

    return prisma.warehouse.update({
      where: { id },
      data: { is_active: false },
      select: WarehouseSelect,
    });
  },
};
