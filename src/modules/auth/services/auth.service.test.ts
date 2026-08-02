import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "./auth.service";

function createRepositoryMock() {
  return {
    findByEmail: vi.fn(),
  } as unknown as AuthRepository;
}

describe("AuthService", () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: AuthService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new AuthService(repository);
  });

  it("lança erro quando o usuário não existe", async () => {
    vi.mocked(repository.findByEmail).mockResolvedValue(null);

    await expect(
      service.login({ email: "inexistente@teste.com", password: "123456" })
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("lança erro quando a senha está incorreta", async () => {
    const hashed = bcrypt.hashSync("senha-correta", 4);
    vi.mocked(repository.findByEmail).mockResolvedValue({
      id: 1,
      email: "user@teste.com",
      password: hashed,
      createdAt: new Date(),
    });

    await expect(
      service.login({ email: "user@teste.com", password: "senha-errada" })
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("retorna um token válido quando as credenciais estão corretas", async () => {
    const hashed = bcrypt.hashSync("senha-correta", 4);
    vi.mocked(repository.findByEmail).mockResolvedValue({
      id: 1,
      email: "user@teste.com",
      password: hashed,
      createdAt: new Date(),
    });

    const result = await service.login({ email: "user@teste.com", password: "senha-correta" });

    expect(result.token).toEqual(expect.any(String));

    const payload = jwt.verify(result.token, process.env.JWT_SECRET as string) as unknown as {
      sub: number;
      email: string;
    };
    expect(payload.sub).toBe(1);
    expect(payload.email).toBe("user@teste.com");
  });
});
