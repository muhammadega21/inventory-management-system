import crypto from "node:crypto";
import slugify from "slugify";

export const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const generateCsrfSecret = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateSlug = (text: string) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};
