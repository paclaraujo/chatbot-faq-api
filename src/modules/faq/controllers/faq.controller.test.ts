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
    it("retorna 200 com a lista de FAQs", async () => {
      const faqs = [{ id: 1, question: "Q1", answer: "A1", category: "geral" }];
      mockRepo.findAllFaqs.mockResolvedValue(faqs);
      const res = mockResponse();

      await FaqController.list(mockRequest(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(faqs);
    });

    it("retorna 400 quando o repositório falha", async () => {
      mockRepo.findAllFaqs.mockRejectedValue(new Error("falha no banco"));
      const res = mockResponse();

      await FaqController.list(mockRequest(), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "falha no banco" });
    });
  });

  describe("create", () => {
    it("retorna 400 quando a pergunta não é informada", async () => {
      const res = mockResponse();

      await FaqController.create(
        mockRequest({ body: { question: "  ", answer: "A", category: "C" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Pergunta é obrigatória" });
    });

    it("retorna 400 quando a resposta não é informada", async () => {
      const res = mockResponse();

      await FaqController.create(
        mockRequest({ body: { question: "Q", answer: "", category: "C" } }),
        res
      );

      expect(res.json).toHaveBeenCalledWith({ message: "Resposta é obrigatória" });
    });

    it("retorna 400 quando a categoria não é informada", async () => {
      const res = mockResponse();

      await FaqController.create(
        mockRequest({ body: { question: "Q", answer: "A", category: "" } }),
        res
      );

      expect(res.json).toHaveBeenCalledWith({ message: "Categoria é obrigatória" });
    });

    it("retorna 400 quando já existe pergunta igual", async () => {
      mockRepo.findByQuestion.mockResolvedValue({ id: 1, question: "Q" });
      const res = mockResponse();

      await FaqController.create(
        mockRequest({ body: { question: "Q", answer: "A", category: "C" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Já existe uma pergunta cadastrada com esse mesmo texto",
      });
    });

    it("cria a FAQ e retorna 201", async () => {
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
    it("retorna 400 quando a FAQ não existe", async () => {
      mockRepo.findById.mockResolvedValue(null);
      const res = mockResponse();

      await FaqController.update(
        mockRequest({ params: { id: "1" }, body: { answer: "Nova" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "FAQ não encontrado" });
    });

    it("retorna 400 quando a nova pergunta já pertence a outra FAQ", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, question: "Q1" });
      mockRepo.findByQuestion.mockResolvedValue({ id: 2, question: "Q2" });
      const res = mockResponse();

      await FaqController.update(
        mockRequest({ params: { id: "1" }, body: { question: "Q2" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Já existe uma pergunta cadastrada com esse mesmo texto",
      });
    });

    it("atualiza a FAQ e retorna 200", async () => {
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
    it("retorna 400 quando a FAQ não existe", async () => {
      mockRepo.findById.mockResolvedValue(null);
      const res = mockResponse();

      await FaqController.delete(mockRequest({ params: { id: "999" } }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "FAQ não encontrado" });
    });

    it("remove a FAQ e retorna 204", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, question: "Q1" });
      mockRepo.delete.mockResolvedValue({ id: 1 });
      const res = mockResponse();

      await FaqController.delete(mockRequest({ params: { id: "1" } }), res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
