import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import "dotenv/config";
import { sendError } from "../common/utils/response.util.js";

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown;
}

const getPrismaError = (error: unknown) => {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }

  const candidate = error as { code?: string; meta?: { target?: unknown } };

  return {
    code: candidate.code,
    target: candidate.meta?.target,
  };
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: unknown = null;
  const isProduction = process.env.NODE_ENV === "production";

  if (err && typeof err === "object" && "statusCode" in err) {
    const appError = err as AppError;
    statusCode = appError.statusCode ?? 500;
    message = appError.message || message;
    errors = appError.errors ?? null;
  } else {
    const prismaError = getPrismaError(err);

    switch (prismaError?.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with the same unique value already exists";
        errors = prismaError.target ?? null;
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        statusCode = 409;
        message =
          "The record cannot be changed because it is still referenced by related data";
        break;
      default:
        if (err instanceof Error && !isProduction) {
          errors = { stack: err.stack };
        }
    }
  }

  if (isProduction && statusCode === 500) {
    message = "Internal Server Error";
    errors = null;
  }

  sendError(res, message, statusCode, errors);
};

export const createError = (
  message: string,
  statusCode: number,
  errors: unknown = null,
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};
