import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { mockRequest, mockResponse } from "../test-utils/http";
import { ConflictError, NotFoundError, UnauthorizedError } from "../shared/errors";
import { Prisma } from "../../generated/prisma/client";
import { errorHandler } from "./error-handler.middleware";

describe("errorHandler", () => {
  it("maps a NotFoundError to 404", () => {
    const res = mockResponse();

    errorHandler(new NotFoundError("FAQ não encontrado"), mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "FAQ não encontrado" });
  });

  it("maps a ConflictError to 409", () => {
    const res = mockResponse();

    errorHandler(new ConflictError("Duplicado"), mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("maps an UnauthorizedError to 401", () => {
    const res = mockResponse();

    errorHandler(new UnauthorizedError("Credenciais inválidas"), mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("maps a ZodError to 400 with a list of field errors", () => {
    const res = mockResponse();
    const result = z.object({ question: z.string().min(1) }).safeParse({ question: "" });

    errorHandler(result.error, mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Dados inválidos",
        errors: expect.any(Array),
      })
    );
  });

  it("maps a Prisma P2025 error to 404", () => {
    const res = mockResponse();
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "7.9.1",
    });

    errorHandler(error, mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("maps a Prisma P2002 error to 409", () => {
    const res = mockResponse();
    const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "7.9.1",
    });

    errorHandler(error, mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("maps an unexpected error to 500 without leaking its message", () => {
    const res = mockResponse();
    vi.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(new Error("detalhe interno do banco"), mockRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro interno no servidor" });

    vi.restoreAllMocks();
  });
});
