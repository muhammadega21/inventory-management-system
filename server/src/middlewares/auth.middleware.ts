import { NextFunction, Request, Response } from "express";
import { createError } from "./errorHandler.middleware.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AuthUser } from "../types/auth.types.js";

interface JwtPayload {
  id: number;
}

const decodeAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  if (typeof decoded !== "object" || typeof decoded.id !== "number") {
    throw createError("Invalid access token", 401);
  }

  return decoded as JwtPayload;
};

const findAuthUser = async (id: number): Promise<AuthUser | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      is_active: true,
    },
  });
};

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw createError("Unauthorized: No access token provided", 401);
    }

    const decoded = decodeAccessToken(token);
    const user = await findAuthUser(decoded.id);

    if (!user) {
      throw createError("Unauthorized: User not found", 401);
    }

    if (!user.is_active) {
      throw createError("Unauthorized: User account is inactive", 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(createError(error.message || "Unauthorized", 401));
  }
};

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next();
    }

    const decoded = decodeAccessToken(token);

    const user = await findAuthUser(decoded.id);

    if (user?.is_active) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

export { isAuth, optionalAuth };
