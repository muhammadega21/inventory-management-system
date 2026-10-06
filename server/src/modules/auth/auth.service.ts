import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { LoginInput } from "./auth.schema.js";

const loginUserSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  is_active: true,
} as const;

export const AuthService = {
  async loginUser({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: loginUserSelect,
    });

    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw createError("Invalid email or password", 401);
    }

    if (!user.is_active) {
      throw createError("User is not active", 401);
    }

    const { password: _password, ...result } = user;

    return result;
  },
};
