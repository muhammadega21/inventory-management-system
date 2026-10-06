import bcrypt from "bcryptjs";
import { paginationMeta } from "../../common/utils/helper.js";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { CreateUserInput, UpdateUserInput } from "./user.schema.js";

// Select
export const UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  is_active: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Helper
const getPaginatedUsers = async (
  where: any,
  page: number,
  limit: number,
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
) => {
  const skip = (page - 1) * limit;

  const orderBy =
    sortBy === "name"
      ? { name: sortOrder }
      : sortBy === "email"
        ? { email: sortOrder }
        : { createdAt: "desc" as const };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: UserSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { data: users, meta: paginationMeta(total, page, limit) };
};

export const UserService = {
  async findAllUsers(query: {
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
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    return getPaginatedUsers(
      where,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
  },

  async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: UserSelect,
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    return user;
  },

  async createUser(data: CreateUserInput) {
    const duplicateUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (duplicateUser) {
      throw createError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        is_active: data.is_active,
      },
      select: UserSelect,
    });
  },

  async updateUser(id: number, data: UpdateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw createError("User not found", 404);
    }

    if (data.email && data.email !== existingUser.email) {
      const duplicateUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      });

      if (duplicateUser) {
        throw createError("Email already exists", 409);
      }
    }

    // code for preventing last admin deactivation
    // if (
    //   existingUser.role === "ADMIN" &&
    //   (data.is_active === false || data.role === "STAFF")
    // ) {
    //   const activeAdminCount = await prisma.user.count({
    //     where: {
    //       role: "ADMIN",
    //       is_active: true,
    //     },
    //   });

    //   if (activeAdminCount <= 1) {
    //     throw createError(
    //       "Cannot deactivate or demote the last active admin",
    //       400,
    //     );
    //   }
    // }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      is_active: data.is_active,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: UserSelect,
    });
  },

  async deleteUser(id: number) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw createError("User not found", 404);
    }

    return prisma.user.update({
      where: { id },
      data: { is_active: false },
      select: UserSelect,
    });
  },
};
