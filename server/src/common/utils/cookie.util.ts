import "dotenv/config";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export const csrfCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export const visitorCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 365,
} as const;

export const authCookieNames = {
  session: "sessionId",
  access: "accessToken",
  refresh: "refreshToken",
  csrf: "csrfToken",
};
