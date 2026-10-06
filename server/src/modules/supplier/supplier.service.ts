import { generateSupplierCode } from "../../common/utils/generateCode.util.js";
import { paginationMeta } from "../../common/utils/helper.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { CreateSupplierInput, UpdateSupplierInput } from "./supplier.schema.js";

export const SupplierSelect = {
  id: true,
  name: true,
  code: true,
  contact_person: true,
  phone: true,
  city: true,
  email: true,
  address: true,
  is_active: true,
  createdAt: true,
  updatedAt: true,
};

const getPaginatedSuppliers = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };

  const [supplier, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: SupplierSelect,
    }),
    prisma.supplier.count({ where }),
  ]);

  return {
    data: supplier,
    meta: paginationMeta(total, page, limit),
  };
};

export const SupplierService = {
  async findAllSuppliers(query: {
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
          contact_person: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          email: {
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
        {
          code: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    return getPaginatedSuppliers(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },
  async findSupplierById(id: number) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: SupplierSelect,
    });

    if (!supplier) {
      throw createError("Supplier not found", 404);
    }

    return supplier;
  },

  async createSupplier(data: CreateSupplierInput) {
    const code = await generateSupplierCode();
    const duplicateSupplier = await prisma.supplier.findUnique({
      where: { code },
      select: { id: true },
    });

    if (duplicateSupplier) {
      throw createError("Code already exists", 400);
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        code,
        contact_person: data.contact_person,
        phone: data.phone,
        email: data.email,
        city: data.city,
        address: data.address,
        is_active: data.is_active,
      },
      select: SupplierSelect,
    });

    return supplier;
  },
  async updateSupplier(id: number, data: UpdateSupplierInput) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existingSupplier) {
      throw createError("Supplier not found", 404);
    }

    return prisma.supplier.update({
      where: { id },
      data: { ...data },
      select: SupplierSelect,
    });
  },
  async deleteSupplier(id: number) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!supplier) {
      throw createError("Supplier not found", 404);
    }

    return prisma.supplier.update({
      where: { id },
      data: { is_active: false },
      select: SupplierSelect,
    });
  },
};
