import { Response } from "express";

export const sendSuccess = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = 200,
  meta?: unknown,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(meta !== undefined ? { meta } : {}),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errors: unknown = null,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
