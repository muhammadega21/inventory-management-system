import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { formatZodErrors } from "../common/utils/validation.util.js";

export const validateParams = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid params",
        errors: formatZodErrors(result.error),
      });
    }

    req.params = result.data as Record<string, string>;
    next();
  };
};
