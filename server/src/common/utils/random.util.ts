import crypto from "node:crypto";

export const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const generateCsrfSecret = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
