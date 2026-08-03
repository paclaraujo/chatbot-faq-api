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

  it("returns 200 with the dashboard, converting query params to numbers", async () => {
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

  it("uses default values when the query does not provide limits", async () => {
    const res = mockResponse();

    await AnalyticsController.dashboard(mockRequest({ query: {} }), res);

    expect(mockRepo.topFaqs).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("propagates errors from the repository", async () => {
    mockRepo.countByMatched.mockRejectedValue(new Error("falha no banco"));

    await expect(
      AnalyticsController.dashboard(mockRequest({ query: {} }), mockResponse())
    ).rejects.toThrow("falha no banco");
  });
});
