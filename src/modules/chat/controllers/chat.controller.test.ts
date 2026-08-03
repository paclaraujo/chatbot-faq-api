import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequest, mockResponse } from "../../../test-utils/http";

const mockRepo = vi.hoisted(() => ({
  findSimilarFaq: vi.fn(),
  createInteraction: vi.fn(),
  findHistory: vi.fn(),
}));

vi.mock("../repositories/chat.repository", () => ({
  ChatRepository: vi.fn().mockImplementation(function ChatRepository() {
    return mockRepo;
  }),
}));

import { ChatController } from "./chat.controller";

describe("ChatController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ask", () => {
    it("returns 200 with the matched answer", async () => {
      mockRepo.findSimilarFaq.mockResolvedValue({
        id: 1,
        question: "Q1",
        answer: "A1",
        category: "geral",
      });
      mockRepo.createInteraction.mockResolvedValue({});
      const res = mockResponse();

      await ChatController.ask(mockRequest({ body: { question: "Q1" } }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ matched: true, answer: "A1" })
      );
    });

    it("propagates errors from the repository", async () => {
      mockRepo.findSimilarFaq.mockRejectedValue(new Error("falha no banco"));

      await expect(
        ChatController.ask(mockRequest({ body: { question: "Q1" } }), mockResponse())
      ).rejects.toThrow("falha no banco");
    });
  });

  describe("history", () => {
    it("returns 200 with the history", async () => {
      const history = [{ id: 1, question: "Q1" }];
      mockRepo.findHistory.mockResolvedValue(history);
      const res = mockResponse();

      await ChatController.history(mockRequest(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(history);
    });

    it("propagates errors from the repository", async () => {
      mockRepo.findHistory.mockRejectedValue(new Error("falha no banco"));

      await expect(ChatController.history(mockRequest(), mockResponse())).rejects.toThrow(
        "falha no banco"
      );
    });
  });
});
