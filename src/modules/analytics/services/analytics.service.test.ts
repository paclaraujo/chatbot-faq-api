import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsRepository } from "../repositories/analytics.repository";
import { AnalyticsService } from "./analytics.service";

function createRepositoryMock() {
  return {
    countByMatched: vi.fn(),
    topFaqs: vi.fn(),
    unansweredQuestions: vi.fn(),
    distributionByCategory: vi.fn(),
    timeline: vi.fn(),
  } as unknown as AnalyticsRepository;
}

describe("AnalyticsService", () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: AnalyticsService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new AnalyticsService(repository);
    vi.mocked(repository.countByMatched).mockResolvedValue([
      { matched: true, _count: 6 },
      { matched: false, _count: 4 },
    ]);
    vi.mocked(repository.topFaqs).mockResolvedValue([]);
    vi.mocked(repository.unansweredQuestions).mockResolvedValue([]);
    vi.mocked(repository.distributionByCategory).mockResolvedValue([]);
    vi.mocked(repository.timeline).mockResolvedValue([]);
  });

  it("usa os limites informados na query", async () => {
    await service.dashboard({ topLimit: 3, unansweredLimit: 7, timelineDays: 10 });

    expect(repository.topFaqs).toHaveBeenCalledWith(3);
    expect(repository.unansweredQuestions).toHaveBeenCalledWith(7);
    expect(repository.timeline).toHaveBeenCalledWith(10);
  });

  it("usa os valores padrão quando nenhum limite é informado", async () => {
    await service.dashboard({});

    expect(repository.topFaqs).toHaveBeenCalledWith(5);
    expect(repository.unansweredQuestions).toHaveBeenCalledWith(5);
    expect(repository.timeline).toHaveBeenCalledWith(30);
  });

  it("calcula o total de interações e a taxa de match", async () => {
    const result = await service.dashboard({});

    expect(result.totalInteractions).toBe(10);
    expect(result.totalMatched).toBe(6);
    expect(result.totalUnmatched).toBe(4);
    expect(result.matchRate).toBe(0.6);
  });

  it("retorna matchRate 0 quando não há interações", async () => {
    vi.mocked(repository.countByMatched).mockResolvedValue([]);

    const result = await service.dashboard({});

    expect(result.totalInteractions).toBe(0);
    expect(result.matchRate).toBe(0);
  });
});
