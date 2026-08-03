import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../shared/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express only treats a 4-arg function as an error-handling middleware.
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Recurso não encontrado" });
    }

    if (err.code === "P2002") {
      return res.status(409).json({ message: "Registro duplicado" });
    }
  }

  console.error(err);

  return res.status(500).json({ message: "Erro interno no servidor" });
}
