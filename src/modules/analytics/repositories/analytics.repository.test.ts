import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  interaction: {
    groupBy: vi.fn(),
  },
  fAQ: {
    findMany: vi.fn(),
  },
}));

vi.mock("../../../database/prisma", () => ({
  prisma: mockPrisma,
}));

import { AnalyticsRepository } from "./analytics.repository";

describe("AnalyticsRepository", () => {
  let repository: AnalyticsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AnalyticsRepository();
  });

  it("countByMatched agrupa interações por status de match", async () => {
    const grouped = [
      { matched: true, _count: 3 },
      { matched: false, _count: 1 },
    ];
    mockPrisma.interaction.groupBy.mockResolvedValue(grouped);

    const result = await repository.countByMatched();

    expect(mockPrisma.interaction.groupBy).toHaveBeenCalledWith({
      by: ["matched"],
      _count: true,
    });
    expect(result).toBe(grouped);
  });

  it("topFaqs ordena por contagem, aplica o limite e junta os dados da FAQ", async () => {
    mockPrisma.interaction.groupBy.mockResolvedValue([
      { faqId: 1, _count: 2 },
      { faqId: 2, _count: 5 },
      { faqId: 3, _count: 1 },
    ]);
    mockPrisma.fAQ.findMany.mockResolvedValue([
      { id: 1, question: "Q1", category: "geral" },
      { id: 2, question: "Q2", category: "geral" },
    ]);

    const result = await repository.topFaqs(2);

    expect(result).toEqual([
      { faqId: 2, question: "Q2", category: "geral", count: 5 },
      { faqId: 1, question: "Q1", category: "geral", count: 2 },
    ]);
  });

  it("topFaqs preenche pergunta/categoria vazias quando a FAQ não é encontrada", async () => {
    mockPrisma.interaction.groupBy.mockResolvedValue([{ faqId: 99, _count: 1 }]);
    mockPrisma.fAQ.findMany.mockResolvedValue([]);

    const result = await repository.topFaqs(5);

    expect(result).toEqual([{ faqId: 99, question: "", category: "", count: 1 }]);
  });

  it("unansweredQuestions executa a query raw e retorna o resultado", async () => {
    const rows = [{ question: "não sei", count: 2, lastAskedAt: new Date() }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.unansweredQuestions(5);

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });

  it("distributionByCategory executa a query raw e retorna o resultado", async () => {
    const rows = [{ category: "geral", count: 4 }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.distributionByCategory();

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });

  it("timeline executa a query raw e retorna o resultado", async () => {
    const rows = [{ date: new Date(), count: 3 }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.timeline(30);

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });
});
