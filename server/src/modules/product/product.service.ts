import { Prisma } from "@prisma/client";
import { generateProductSku } from "../../common/utils/generateCode.util.js";
import { paginationMeta } from "../../common/utils/helper.js";
import { deleteFromCloudinary } from "../../common/utils/upload.util.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { CreateProductInput, UpdateProductInput } from "./product.schema.js";

export const ProductSelect = {
  id: true,
  category: {
    select: {
      id: true,
      name: true,
      description: true,
      is_active: true,
    },
  },
  name: true,
  sku: true,
  unit: true,
  minimum_stock: true,
  description: true,
  image: true,
  is_active: true,
  createdAt: true,
  updatedAt: true,
} as const;

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
      select: ProductSelect,
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
      select: ProductSelect,
    });

    if (!product) {
      throw createError("Product not found", 404);
    }

    return product;
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
      select: ProductSelect,
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
      select: ProductSelect,
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
      select: ProductSelect,
    });
  },
};
