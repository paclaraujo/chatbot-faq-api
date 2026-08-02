import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FaqRepository } from "../repositories/faq.repository";
import { FaqService } from "./faq.service";

function createRepositoryMock() {
  return {
    findAllFaqs: vi.fn(),
    findById: vi.fn(),
    findByQuestion: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } satisfies Partial<Record<keyof FaqRepository, unknown>> as unknown as FaqRepository;
}

describe("FaqService", () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: FaqService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new FaqService(repository);
  });

  describe("list", () => {
    it("retorna todas as FAQs do repositório", async () => {
      const faqs = [{ id: 1, question: "Q1", answer: "A1", category: "geral" }];
      vi.mocked(repository.findAllFaqs).mockResolvedValue(faqs as never);

      const result = await service.list();

      expect(result).toBe(faqs);
      expect(repository.findAllFaqs).toHaveBeenCalledOnce();
    });
  });

  describe("create", () => {
    it("cria a FAQ quando não existe pergunta igual", async () => {
      vi.mocked(repository.findByQuestion).mockResolvedValue(null);
      const created = { id: 1, question: "Nova pergunta", answer: "R", category: "geral" };
      vi.mocked(repository.create).mockResolvedValue(created as never);

      const data = { question: "Nova pergunta", answer: "R", category: "geral" };
      const result = await service.create(data);

      expect(repository.findByQuestion).toHaveBeenCalledWith("Nova pergunta");
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(result).toBe(created);
    });

    it("lança erro ao tentar criar pergunta duplicada", async () => {
      vi.mocked(repository.findByQuestion).mockResolvedValue({
        id: 1,
        question: "Já existe",
        answer: "R",
        category: "geral",
      } as never);

      await expect(
        service.create({ question: "Já existe", answer: "R", category: "geral" })
      ).rejects.toThrow("Já existe uma pergunta cadastrada com esse mesmo texto");

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("lança erro quando a FAQ não existe", async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.update(999, { answer: "novo" })).rejects.toThrow(
        "FAQ não encontrado"
      );

      expect(repository.update).not.toHaveBeenCalled();
    });

    it("atualiza a FAQ quando nenhuma pergunta é enviada", async () => {
      const existing = { id: 1, question: "Q1", answer: "A1", category: "geral" };
      vi.mocked(repository.findById).mockResolvedValue(existing as never);
      vi.mocked(repository.update).mockResolvedValue({ ...existing, answer: "A2" } as never);

      const result = await service.update(1, { answer: "A2" });

      expect(repository.findByQuestion).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(1, { answer: "A2" });
      expect(result).toEqual({ ...existing, answer: "A2" });
    });

    it("atualiza a FAQ quando a pergunta enviada é a mesma do próprio registro", async () => {
      const existing = { id: 1, question: "Q1", answer: "A1", category: "geral" };
      vi.mocked(repository.findById).mockResolvedValue(existing as never);
      vi.mocked(repository.findByQuestion).mockResolvedValue(existing as never);
      vi.mocked(repository.update).mockResolvedValue(existing as never);

      await service.update(1, { question: "Q1" });

      expect(repository.update).toHaveBeenCalledWith(1, { question: "Q1" });
    });

    it("lança erro ao atualizar para uma pergunta que já pertence a outra FAQ", async () => {
      const existing = { id: 1, question: "Q1", answer: "A1", category: "geral" };
      const other = { id: 2, question: "Q2", answer: "A2", category: "geral" };
      vi.mocked(repository.findById).mockResolvedValue(existing as never);
      vi.mocked(repository.findByQuestion).mockResolvedValue(other as never);

      await expect(service.update(1, { question: "Q2" })).rejects.toThrow(
        "Já existe uma pergunta cadastrada com esse mesmo texto"
      );

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("lança erro quando a FAQ não existe", async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow("FAQ não encontrado");
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it("remove a FAQ quando ela existe", async () => {
      const existing = { id: 1, question: "Q1", answer: "A1", category: "geral" };
      vi.mocked(repository.findById).mockResolvedValue(existing as never);
      vi.mocked(repository.delete).mockResolvedValue(existing as never);

      const result = await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(existing);
    });
  });
});
