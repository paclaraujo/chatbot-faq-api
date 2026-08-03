import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequest, mockResponse } from "../../../test-utils/http";

const mockRepo = vi.hoisted(() => ({
  findAllFaqs: vi.fn(),
  findById: vi.fn(),
  findByQuestion: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../repositories/faq.repository", () => ({
  FaqRepository: vi.fn().mockImplementation(function FaqRepository() {
    return mockRepo;
  }),
}));

import { FaqController } from "./faq.controller";

describe("FaqController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns 200 with the list of FAQs", async () => {
      const faqs = [{ id: 1, question: "Q1", answer: "A1", category: "geral" }];
      mockRepo.findAllFaqs.mockResolvedValue(faqs);
      const res = mockResponse();

      await FaqController.list(mockRequest(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(faqs);
    });

    it("propagates errors from the repository", async () => {
      mockRepo.findAllFaqs.mockRejectedValue(new Error("falha no banco"));

      await expect(FaqController.list(mockRequest(), mockResponse())).rejects.toThrow(
        "falha no banco"
      );
    });
  });

  describe("create", () => {
    it("propagates a conflict error when an identical question already exists", async () => {
      mockRepo.findByQuestion.mockResolvedValue({ id: 1, question: "Q" });

      await expect(
        FaqController.create(
          mockRequest({ body: { question: "Q", answer: "A", category: "C" } }),
          mockResponse()
        )
      ).rejects.toThrow("Já existe uma pergunta cadastrada com esse mesmo texto");
    });

    it("creates the FAQ and returns 201", async () => {
      mockRepo.findByQuestion.mockResolvedValue(null);
      const created = { id: 1, question: "Q", answer: "A", category: "C" };
      mockRepo.create.mockResolvedValue(created);
      const res = mockResponse();

      await FaqController.create(
        mockRequest({ body: { question: "Q", answer: "A", category: "C" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe("update", () => {
    it("propagates a not-found error when the FAQ does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        FaqController.update(
          mockRequest({ params: { id: "1" }, body: { answer: "Nova" } }),
          mockResponse()
        )
      ).rejects.toThrow("FAQ não encontrado");
    });

    it("propagates a conflict error when the new question belongs to another FAQ", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, question: "Q1" });
      mockRepo.findByQuestion.mockResolvedValue({ id: 2, question: "Q2" });

      await expect(
        FaqController.update(
          mockRequest({ params: { id: "1" }, body: { question: "Q2" } }),
          mockResponse()
        )
      ).rejects.toThrow("Já existe uma pergunta cadastrada com esse mesmo texto");
    });

    it("updates the FAQ and returns 200", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, question: "Q1" });
      const updated = { id: 1, question: "Q1", answer: "Nova", category: "C" };
      mockRepo.update.mockResolvedValue(updated);
      const res = mockResponse();

      await FaqController.update(
        mockRequest({ params: { id: "1" }, body: { answer: "Nova" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe("delete", () => {
    it("propagates a not-found error when the FAQ does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        FaqController.delete(mockRequest({ params: { id: "999" } }), mockResponse())
      ).rejects.toThrow("FAQ não encontrado");
    });

    it("removes the FAQ and returns 204", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, question: "Q1" });
      mockRepo.delete.mockResolvedValue({ id: 1 });
      const res = mockResponse();

      await FaqController.delete(mockRequest({ params: { id: "1" } }), res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
