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

  it("countByMatched groups interactions by match status", async () => {
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

  it("topFaqs sorts by count, applies the limit and joins the FAQ data", async () => {
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

  it("topFaqs fills question/category as empty when the FAQ is not found", async () => {
    mockPrisma.interaction.groupBy.mockResolvedValue([{ faqId: 99, _count: 1 }]);
    mockPrisma.fAQ.findMany.mockResolvedValue([]);

    const result = await repository.topFaqs(5);

    expect(result).toEqual([{ faqId: 99, question: "", category: "", count: 1 }]);
  });

  it("unansweredQuestions runs the raw query and returns the result", async () => {
    const rows = [{ question: "não sei", count: 2, lastAskedAt: new Date() }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.unansweredQuestions(5);

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });

  it("distributionByCategory runs the raw query and returns the result", async () => {
    const rows = [{ category: "geral", count: 4 }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.distributionByCategory();

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });

  it("timeline runs the raw query and returns the result", async () => {
    const rows = [{ date: new Date(), count: 3 }];
    mockPrisma.$queryRaw.mockResolvedValue(rows);

    const result = await repository.timeline(30);

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(rows);
  });
});
