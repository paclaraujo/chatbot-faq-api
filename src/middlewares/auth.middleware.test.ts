import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import { authMiddleware } from "./auth.middleware";
import { mockRequest, mockResponse } from "../test-utils/http";

describe("authMiddleware", () => {
  it("retorna 401 quando o header Authorization não é informado", () => {
    const req = mockRequest({ headers: {} });
    const res = mockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não informado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o header não usa o esquema Bearer", () => {
    const req = mockRequest({ headers: { authorization: "Basic abc" } });
    const res = mockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não informado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o token é inválido", () => {
    const req = mockRequest({ headers: { authorization: "Bearer token-invalido" } });
    const res = mockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token inválido ou expirado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("chama next() e popula req.user quando o token é válido", () => {
    const token = jwt.sign({ sub: 1, email: "user@teste.com" }, process.env.JWT_SECRET as string);
    const req = mockRequest({ headers: { authorization: `Bearer ${token}` } });
    const res = mockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ sub: 1, email: "user@teste.com" });
  });
});
