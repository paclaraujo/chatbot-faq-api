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

  it("propagates an unauthorized error when the credentials are invalid", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(
      AuthController.login(
        mockRequest({ body: { email: "user@teste.com", password: "123456" } }),
        mockResponse()
      )
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("returns 200 with the token when the credentials are valid", async () => {
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
