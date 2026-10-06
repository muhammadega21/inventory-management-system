import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "../../lib/prisma.js";
import { hashToken } from "./random.util.js";

interface TokenPayload extends JwtPayload {
  id: number;
}

interface GenerateTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface VerifiedRefreshToken {
  userId: number;
  rememberMe: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_SECRET or REFRESH_SECRET is not defined");
}

const generateToken = async (
  userId: number,
  sessionId: string,
  rememberMe: boolean = false,
): Promise<GenerateTokenResponse> => {
  const payload: TokenPayload = {
    id: userId,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: rememberMe ? "7d" : "1d",
  });

  const expiryDays = rememberMe ? 7 : 1;
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      token: hashToken(refreshToken),
      userId,
      sessionId,
      expiresAt: expiresAt,
      rememberMe: rememberMe,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyRefreshToken = async (
  refreshToken: string,
  sessionId: string,
): Promise<VerifiedRefreshToken | null> => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;
    if (typeof decoded.id !== "number") {
      return null;
    }
    const token = await prisma.refreshToken.findFirst({
      where: {
        token: hashToken(refreshToken),
      },

      select: {
        userId: true,
        sessionId: true,
        rememberMe: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            is_active: true,
          },
        },
      },
    });

    if (
      !token ||
      token.sessionId !== sessionId ||
      token.userId !== decoded.id ||
      token.expiresAt <= new Date() ||
      !token.user.is_active ||
      token.user.id !== decoded.id
    ) {
      return null;
    }

    return {
      userId: token.userId,
      rememberMe: token.rememberMe,
    };
  } catch {
    return null;
  }
};

const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: {
      token: hashToken(refreshToken),
    },
  });
};

export { generateToken, verifyRefreshToken, revokeRefreshToken };
