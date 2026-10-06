import type { NextFunction, Request, Response } from "express";
import { createError } from "./errorHandler.middleware.js";
import type { UserRole } from "../types/auth.types.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError("Forbidden: You do not have permission", 403));
    }

    next();
  };
};
