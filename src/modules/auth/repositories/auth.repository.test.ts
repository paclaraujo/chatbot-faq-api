import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
  },
}));

vi.mock("../../../database/prisma", () => ({
  prisma: mockPrisma,
}));

import { AuthRepository } from "./auth.repository";

describe("AuthRepository", () => {
  let repository: AuthRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AuthRepository();
  });

  it("findByEmail busca o usuário pelo e-mail", async () => {
    const user = { id: 1, email: "user@teste.com", password: "hash", createdAt: new Date() };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await repository.findByEmail("user@teste.com");

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "user@teste.com" },
    });
    expect(result).toBe(user);
  });
});
