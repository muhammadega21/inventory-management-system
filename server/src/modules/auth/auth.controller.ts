import { NextFunction, Request, Response } from "express";
import {
  authCookieNames,
  cookieOptions,
  csrfCookieOptions,
} from "../../common/utils/cookie.util.js";
import {
  generateSessionId,
  hashToken,
} from "../../common/utils/random.util.js";
import {
  generateToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/token.util.js";
import { generateCsrfToken } from "../../middlewares/csrf.middleware.js";
import { AuthService } from "./auth.service.js";
import { sendSuccess } from "../../common/utils/response.util.js";
import { createError } from "../../middlewares/errorHandler.middleware.js";
import { prisma } from "../../lib/prisma.js";

const setupAuthCookies = async (
  res: Response,
  userId: number,
  rememberMe: boolean = false,
) => {
  const sessionId = generateSessionId();
  const cookieMaxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  const { accessToken, refreshToken } = await generateToken(
    userId,
    sessionId,
    rememberMe,
  );

  res.cookie("sessionId", sessionId, {
    ...cookieOptions,
    maxAge: cookieMaxAge,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  }); // 15 menit

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: cookieMaxAge,
  });

  generateCsrfToken(res, cookieMaxAge);
};

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.loginUser(req.body);

      await setupAuthCookies(res, user.id, req.body.rememberMe);

      sendSuccess(res, "Login Successful", { user });
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, "Profile retrieved successfully", req.user);
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenCookie = req.cookies?.[authCookieNames.refresh];
      const sessionId = req.cookies?.[authCookieNames.session];

      if (!refreshTokenCookie || !sessionId) {
        throw createError("Refresh token or session missing", 401);
      }

      const verified = await verifyRefreshToken(refreshTokenCookie, sessionId);

      if (!verified) {
        throw createError("Invalid or expired refresh token", 401);
      }

      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          token: hashToken(refreshTokenCookie),
        },
      });

      await revokeRefreshToken(refreshTokenCookie);
      await setupAuthCookies(
        res,
        verified.userId,
        tokenRecord?.rememberMe ?? false,
      );

      sendSuccess(res, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  },

  async csrfToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.setHeader("Cache-Control", "no-store");

      const existingToken = req.cookies?.[authCookieNames.csrf];

      const csrfToken =
        existingToken ?? generateCsrfToken(res, 24 * 60 * 60 * 1000);

      return sendSuccess(res, "CSRF token retrieved successfully", {
        csrfToken,
      });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenCookie = req.cookies?.[authCookieNames.refresh];

      if (refreshTokenCookie) {
        await revokeRefreshToken(refreshTokenCookie);
      }

      res.clearCookie(authCookieNames.session, cookieOptions);
      res.clearCookie(authCookieNames.access, cookieOptions);
      res.clearCookie(authCookieNames.refresh, cookieOptions);
      res.clearCookie(authCookieNames.csrf, csrfCookieOptions);

      return sendSuccess(res, "Logout successful");
    } catch (error) {
      next(error);
    }
  },
};
