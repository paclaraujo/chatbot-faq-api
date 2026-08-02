import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  interaction: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("../../../database/prisma", () => ({
  prisma: mockPrisma,
}));

import { ChatRepository } from "./chat.repository";

describe("ChatRepository", () => {
  let repository: ChatRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ChatRepository();
  });

  describe("findSimilarFaq", () => {
    it("retorna a FAQ mais similar quando encontrada", async () => {
      const match = { id: 1, question: "Q1", answer: "A1", category: "geral" };
      mockPrisma.$queryRaw.mockResolvedValue([match]);

      const result = await repository.findSimilarFaq("Q1");

      expect(result).toEqual(match);
    });

    it("retorna null quando nenhuma FAQ similar é encontrada", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      const result = await repository.findSimilarFaq("desconhecida");

      expect(result).toBeNull();
    });
  });

  it("createInteraction cria uma interação", async () => {
    const data = { question: "Q1", matched: true, faqId: 1 };
    const created = { id: 1, ...data };
    mockPrisma.interaction.create.mockResolvedValue(created);

    const result = await repository.createInteraction(data);

    expect(mockPrisma.interaction.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(created);
  });

  it("findHistory busca o histórico ordenado com a FAQ associada", async () => {
    const history = [{ id: 1, question: "Q1", matched: true, faq: null }];
    mockPrisma.interaction.findMany.mockResolvedValue(history);

    const result = await repository.findHistory();

    expect(mockPrisma.interaction.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      include: { faq: true },
    });
    expect(result).toBe(history);
  });
});
