import { Prisma } from "@prisma/client";
import { generateProductSku } from "../../common/utils/generateCode.util.js";
import { paginationMeta } from "../../common/utils/helper.js";
import { deleteFromCloudinary } from "../../common/utils/upload.util.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { CreateProductInput, UpdateProductInput } from "./product.schema.js";
import { ProductDetailSelect, ProductListSelect } from "./product.select.js";

const getPaginatedProducts = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: ProductListSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: paginationMeta(total, page, limit),
  };
};

export const ProductService = {
  async findAllProducts(query: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder: "asc" | "desc";
    categoryId?: number;
  }) {
    const where: any = {};

    if (query.categoryId !== undefined) {
      where.categoryId = query.categoryId;
    }

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    return getPaginatedProducts(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: ProductDetailSelect,
    });

    if (!product) {
      throw createError("Product not found", 404);
    }

    const warehouses = await prisma.warehouse.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        address: true,
        is_active: true,
        inventories: {
          where: { productId: id },
          select: { id: true, quantity: true },
        },
      },
    });

    const inventories = warehouses.map(
      ({ inventories: rows, ...warehouse }) => {
        const inventory = rows[0];
        return {
          id: inventory?.id ?? null,
          quantity: inventory?.quantity ?? 0,
          warehouse,
        };
      },
    );

    return {
      ...product,
      inventories,
    };
  },

  async createProduct(data: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: { id: data.category_id },
      select: { id: true, is_active: true },
    });

    if (!category) {
      throw createError("Category not found", 404);
    }

    if (category.is_active === false) {
      throw createError("Cannot create product with inactive category", 400);
    }

    const sku = await generateProductSku();

    const duplicateProduct = await prisma.product.findUnique({
      where: { sku },
      select: { id: true },
    });

    if (duplicateProduct) {
      throw createError("SKU already exists", 400);
    }

    const product = await prisma.product.create({
      data: {
        categoryId: data.category_id,
        name: data.name,
        sku: sku,
        unit: data.unit,
        minimum_stock: data.minimum_stock,
        description: data.description,
        image: data.image ? data.image : null,
        is_active: data.is_active,
      },
      select: ProductListSelect,
    });

    return product;
  },

  async updateProduct(id: number, data: UpdateProductInput) {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw createError("Product not found", 404);
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.unit !== undefined) {
      updateData.unit = data.unit;
    }

    if (data.minimum_stock !== undefined) {
      updateData.minimum_stock = data.minimum_stock;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active;
    }

    if (data.category_id !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: data.category_id },
        select: {
          id: true,
          is_active: true,
        },
      });

      if (!category) {
        throw createError("Category not found", 404);
      }

      if (!category.is_active) {
        throw createError("Cannot update product with inactive category", 400);
      }

      updateData.category = {
        connect: { id: data.category_id },
      };
    }

    const oldImage = existingProduct.image;

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      select: ProductListSelect,
    });

    if (data.image && oldImage && oldImage !== data.image) {
      deleteFromCloudinary(oldImage).catch((err) => {
        console.error("Failed to delete old image from Cloudinary:", err);
      });
    }

    return product;
  },

  async deleteProduct(id: number) {
    const exitingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!exitingProduct) {
      throw createError("Product not found", 404);
    }

    // dinonaktifkan karena soft delete. aktifkan jika ada pertimbangan untuk membuat hard delete
    // const imageUrl = exitingProduct.image;

    // if (imageUrl) {
    //   await deleteFromCloudinary(imageUrl);
    // }

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
        "Cannot deactivate product while stock still exists",
        400,
      );
    }

    return prisma.product.update({
      where: { id },
      data: { is_active: false },
      select: ProductListSelect,
    });
  },

  async getProductSummary() {
    const [activeProducts, lowStockResult, stockout, inactiveProducts] =
      await Promise.all([
        prisma.product.count({
          where: { is_active: true },
        }),

        prisma.$queryRaw<Array<{ total: bigint }>>`
  SELECT COUNT(*) AS total
  FROM inventories i
  INNER JOIN products p ON p.id = i.product_id
  INNER JOIN warehouses w ON w.id = i.warehouse_id
  WHERE p.is_active = true
    AND w.is_active = true
    AND i.quantity < p.minimum_stock
`,

        prisma.inventory.count({
          where: {
            quantity: 0,
            product: { is_active: true },
            warehouse: { is_active: true },
          },
        }),

        prisma.product.count({
          where: { is_active: false },
        }),
      ]);

    return {
      activeProducts,
      lowStock: Number(lowStockResult[0]?.total ?? 0n),
      stockout,
      inactiveProducts,
    };
  },
};
