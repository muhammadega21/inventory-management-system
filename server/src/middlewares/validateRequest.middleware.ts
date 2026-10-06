import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { formatZodErrors } from "../common/utils/validation.util.js";

export const validateRequest = <T>(schema: ZodType<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(result.error),
      });
    }

    req.body = result.data;
    next();
  };
};
