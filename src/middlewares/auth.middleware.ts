import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
  sub: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as unknown as AuthTokenPayload;

    req.user = payload;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
