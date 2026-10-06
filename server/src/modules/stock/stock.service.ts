import { StockType, TransactionStatus } from "@prisma/client";
import { generateTransactionNumber } from "../../common/utils/generateCode.util.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import {
  StockAdjustmentInput,
  StockInInput,
  StockMovementQuery,
  StockOutInput,
} from "./stock.schema.js";
import { paginationMeta } from "../../common/utils/helper.js";

export const StockMovementSelect = {
  id: true,

  type: true,

  quantity: true,

  quantity_before: true,

  quantity_after: true,

  createdAt: true,

  product: {
    select: {
      id: true,
      name: true,
      sku: true,
      unit: true,
    },
  },

  warehouse: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },

  stockTransaction: {
    select: {
      id: true,
      transaction_number: true,
      transaction_date: true,
      notes: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;

const getPaginatedStockMovements = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  let orderBy;

  switch (sortBy) {
    case "quantity":
      orderBy = {
        quantity: sortOrder,
      };
      break;

    case "quantity_before":
      orderBy = {
        quantity_before: sortOrder,
      };
      break;

    case "quantity_after":
      orderBy = {
        quantity_after: sortOrder,
      };
      break;

    case "createdAt":
    default:
      orderBy = {
        createdAt: sortOrder,
      };
      break;
  }

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: StockMovementSelect,
    }),

    prisma.stockMovement.count({
      where,
    }),
  ]);

  return {
    data: movements,
    meta: paginationMeta(total, page, limit),
  };
};

const validateDuplicateProducts = (items: Array<{ product_id: number }>) => {
  const productIds = items.map((item) => item.product_id);

  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    throw createError(
      "A product cannot appear more than once in the same transaction",
      400,
    );
  }
};

const validateWarehouse = async (warehouseId: number) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id: warehouseId,
    },
    select: {
      id: true,
      name: true,
      code: true,
      is_active: true,
    },
  });

  if (!warehouse) {
    throw createError("Warehouse not found", 404);
  }

  if (!warehouse.is_active) {
    throw createError("Warehouse is inactive", 400);
  }

  return warehouse;
};

const validateProducts = async (productIds: number[]) => {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      sku: true,
      unit: true,
      is_active: true,
    },
  });

  if (products.length !== productIds.length) {
    throw createError("One or more products were not found", 404);
  }

  const inactiveProduct = products.find((product) => !product.is_active);

  if (inactiveProduct) {
    throw createError(`Product "${inactiveProduct.name}" is inactive`, 400);
  }

  return products;
};

const validateSupplier = async (supplierId?: number) => {
  if (supplierId === undefined) {
    return null;
  }

  const supplier = await prisma.supplier.findUnique({
    where: {
      id: supplierId,
    },
    select: {
      id: true,
      name: true,
      code: true,
      is_active: true,
    },
  });

  if (!supplier) {
    throw createError("Supplier not found", 404);
  }

  if (!supplier.is_active) {
    throw createError("Supplier is inactive", 400);
  }

  return supplier;
};

export const StockService = {
  async findAllStockMovements(query: StockMovementQuery) {
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

        {
          warehouse: {
            code: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },

        {
          stockTransaction: {
            transaction_number: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (query.warehouseId !== undefined) {
      where.warehouseId = query.warehouseId;
    }

    if (query.productId !== undefined) {
      where.productId = query.productId;
    }

    if (query.type !== undefined) {
      where.type = query.type;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};

      if (query.dateFrom) {
        where.createdAt.gte = query.dateFrom;
      }

      if (query.dateTo) {
        where.createdAt.lte = query.dateTo;
      }
    }

    return getPaginatedStockMovements(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findStockMovementById(id: number) {
    const movement = await prisma.stockMovement.findUnique({
      where: {
        id,
      },

      select: StockMovementSelect,
    });

    if (!movement) {
      throw createError("Stock movement not found", 404);
    }

    return movement;
  },

  async stockIn(data: StockInInput, userId: number) {
    validateDuplicateProducts(data.items);

    await validateWarehouse(data.warehouse_id);

    await validateSupplier(data.supplier_id);

    const productIds = data.items.map((item) => item.product_id);

    await validateProducts(productIds);

    const transactionDate = data.transaction_date ?? new Date();

    const transactionNumber = generateTransactionNumber(StockType.IN);

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.stockTransaction.create({
        data: {
          transaction_number: transactionNumber,
          type: StockType.IN,
          status: TransactionStatus.POSTED,
          warehouseId: data.warehouse_id,
          supplierId: data.supplier_id ?? null,
          userId,
          transaction_date: transactionDate,
          notes: data.notes ?? null,
        },
      });

      const movements = [];

      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId: item.product_id,
              warehouseId: data.warehouse_id,
            },
          },
        });

        const quantityBefore = inventory?.quantity ?? 0;
        const quantityAfter = quantityBefore + item.quantity;

        await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.product_id,
            quantity: item.quantity,
            physical_quantity: null,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: {
              id: inventory.id,
            },
            data: {
              quantity: quantityAfter,
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.product_id,
              warehouseId: data.warehouse_id,
              quantity: item.quantity,
            },
          });
        }

        const movement = await tx.stockMovement.create({
          data: {
            productId: item.product_id,
            warehouseId: data.warehouse_id,
            stocktransactionId: transaction.id,
            type: StockType.IN,
            quantity: item.quantity,
            quantity_before: quantityBefore,
            quantity_after: quantityAfter,
          },
        });

        movements.push(movement);
      }

      return {
        transaction,
        movements,
      };
    });

    return result;
  },

  async stockOut(data: StockOutInput, userId: number) {
    validateDuplicateProducts(data.items);

    await validateWarehouse(data.warehouse_id);

    const productIds = data.items.map((item) => item.product_id);

    await validateProducts(productIds);

    const transactionDate = data.transaction_date ?? new Date();

    const transactionNumber = generateTransactionNumber(StockType.OUT);

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.stockTransaction.create({
        data: {
          transaction_number: transactionNumber,
          type: StockType.OUT,
          status: TransactionStatus.POSTED,
          warehouseId: data.warehouse_id,
          supplierId: null,
          userId,
          transaction_date: transactionDate,
          notes: data.notes ?? null,
        },
      });

      const movements = [];

      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId: item.product_id,
              warehouseId: data.warehouse_id,
            },
          },
        });

        const quantityBefore = inventory?.quantity ?? 0;

        if (quantityBefore < item.quantity) {
          throw createError(
            `Stock tidak mencukupi untuk product ID ${item.product_id}. Current stock: ${quantityBefore}, requested: ${item.quantity}`,
            400,
          );
        }

        const quantityAfter = quantityBefore - item.quantity;

        await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.product_id,
            quantity: item.quantity,
            physical_quantity: null,
          },
        });

        await tx.inventory.update({
          where: {
            id: inventory!.id,
          },
          data: {
            quantity: quantityAfter,
          },
        });

        const movement = await tx.stockMovement.create({
          data: {
            productId: item.product_id,
            warehouseId: data.warehouse_id,
            stocktransactionId: transaction.id,
            type: StockType.OUT,
            quantity: -item.quantity,
            quantity_before: quantityBefore,
            quantity_after: quantityAfter,
          },
        });

        movements.push(movement);
      }

      return {
        transaction,
        movements,
      };
    });

    return result;
  },

  async stockAdjustment(data: StockAdjustmentInput, userId: number) {
    validateDuplicateProducts(data.items);

    await validateWarehouse(data.warehouse_id);

    const productIds = data.items.map((item) => item.product_id);

    await validateProducts(productIds);

    const transactionDate = data.transaction_date ?? new Date();

    const transactionNumber = generateTransactionNumber(StockType.ADJUSTMENT);

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.stockTransaction.create({
        data: {
          transaction_number: transactionNumber,
          type: StockType.ADJUSTMENT,
          status: TransactionStatus.POSTED,
          warehouseId: data.warehouse_id,
          supplierId: null,
          userId,
          transaction_date: transactionDate,
          notes: data.notes ?? null,
        },
      });

      const movements = [];

      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId: item.product_id,
              warehouseId: data.warehouse_id,
            },
          },
        });

        const quantityBefore = inventory?.quantity ?? 0;

        const quantityAfter = item.physical_quantity;

        const difference = quantityAfter - quantityBefore;

        await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.product_id,
            quantity: difference,
            physical_quantity: item.physical_quantity,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: {
              id: inventory.id,
            },
            data: {
              quantity: quantityAfter,
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.product_id,
              warehouseId: data.warehouse_id,
              quantity: quantityAfter,
            },
          });
        }

        const movement = await tx.stockMovement.create({
          data: {
            productId: item.product_id,
            warehouseId: data.warehouse_id,
            stocktransactionId: transaction.id,
            type: StockType.ADJUSTMENT,
            quantity: difference,
            quantity_before: quantityBefore,
            quantity_after: quantityAfter,
          },
        });

        movements.push(movement);
      }

      return {
        transaction,
        movements,
      };
    });

    return result;
  },
};
