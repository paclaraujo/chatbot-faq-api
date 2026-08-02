import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequest, mockResponse } from "../../../test-utils/http";

const mockRepo = vi.hoisted(() => ({
  countByMatched: vi.fn(),
  topFaqs: vi.fn(),
  unansweredQuestions: vi.fn(),
  distributionByCategory: vi.fn(),
  timeline: vi.fn(),
}));

vi.mock("../repositories/analytics.repository", () => ({
  AnalyticsRepository: vi.fn().mockImplementation(function AnalyticsRepository() {
    return mockRepo;
  }),
}));

import { AnalyticsController } from "./analytics.controller";

describe("AnalyticsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepo.countByMatched.mockResolvedValue([]);
    mockRepo.topFaqs.mockResolvedValue([]);
    mockRepo.unansweredQuestions.mockResolvedValue([]);
    mockRepo.distributionByCategory.mockResolvedValue([]);
    mockRepo.timeline.mockResolvedValue([]);
  });

  it("retorna 200 com o dashboard convertendo os parâmetros de query para número", async () => {
    const res = mockResponse();

    await AnalyticsController.dashboard(
      mockRequest({ query: { topLimit: "2", unansweredLimit: "3", timelineDays: "15" } }),
      res
    );

    expect(mockRepo.topFaqs).toHaveBeenCalledWith(2);
    expect(mockRepo.unansweredQuestions).toHaveBeenCalledWith(3);
    expect(mockRepo.timeline).toHaveBeenCalledWith(15);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("usa os valores padrão quando a query não informa limites", async () => {
    const res = mockResponse();

    await AnalyticsController.dashboard(mockRequest({ query: {} }), res);

    expect(mockRepo.topFaqs).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("retorna 400 quando o repositório falha", async () => {
    mockRepo.countByMatched.mockRejectedValue(new Error("falha no banco"));
    const res = mockResponse();

    await AnalyticsController.dashboard(mockRequest({ query: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "falha no banco" });
  });
});
