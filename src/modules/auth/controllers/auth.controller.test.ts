import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequest, mockResponse } from "../../../test-utils/http";

const mockRepo = vi.hoisted(() => ({
  findByEmail: vi.fn(),
}));

vi.mock("../repositories/auth.repository", () => ({
  AuthRepository: vi.fn().mockImplementation(function AuthRepository() {
    return mockRepo;
  }),
}));

import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 400 quando email ou senha não são informados", async () => {
    const res = mockResponse();

    await AuthController.login(mockRequest({ body: { email: "", password: "" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email e senha são obrigatórios" });
  });

  it("retorna 401 quando as credenciais são inválidas", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    const res = mockResponse();

    await AuthController.login(
      mockRequest({ body: { email: "user@teste.com", password: "123456" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Credenciais inválidas" });
  });

  it("retorna 200 com o token quando as credenciais são válidas", async () => {
    mockRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: "user@teste.com",
      password: bcrypt.hashSync("123456", 4),
      createdAt: new Date(),
    });
    const res = mockResponse();

    await AuthController.login(
      mockRequest({ body: { email: "user@teste.com", password: "123456" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
  });
});
