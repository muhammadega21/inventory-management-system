import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { createError } from "./errorHandler.middleware.js";
import { generateCsrfSecret } from "../common/utils/random.util.js";
import {
  authCookieNames,
  csrfCookieOptions,
} from "../common/utils/cookie.util.js";

export const generateCsrfToken = (res: Response, maxAge?: number) => {
  const token = generateCsrfSecret();

  res.cookie(authCookieNames.csrf, token, {
    ...csrfCookieOptions,
    ...(maxAge !== undefined ? { maxAge } : {}),
  });

  return token;
};

export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // hapus jika masuk tahap production
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const sessionId = req.cookies?.[authCookieNames.session];

  if (!sessionId) {
    throw createError("Unauthorized: No session ID", 401);
  }

  const headerValue =
    req.headers["x-csrf-token"] ??
    req.headers["x-xsrf-token"] ??
    req.headers["csrf-token"];

  const clientToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const csrfToken = req.cookies?.[authCookieNames.csrf];

  if (!clientToken) {
    throw createError("Unauthorized: No CSRF token provided", 403);
  }

  if (!csrfToken) {
    throw createError("Unauthorized: Invalid CSRF token", 403);
  }

  const clientBuffer = Buffer.from(clientToken, "utf8");
  const serverBuffer = Buffer.from(csrfToken, "utf8");

  if (
    clientBuffer.length !== serverBuffer.length ||
    !crypto.timingSafeEqual(clientBuffer, serverBuffer)
  ) {
    return next(createError("Forbidden: Invalid CSRF token", 403));
  }

  next();
};
