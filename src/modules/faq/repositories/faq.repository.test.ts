import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  fAQ: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../database/prisma", () => ({
  prisma: mockPrisma,
}));

import { FaqRepository } from "./faq.repository";

describe("FaqRepository", () => {
  let repository: FaqRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new FaqRepository();
  });

  it("findAllFaqs busca todas as FAQs", async () => {
    const faqs = [{ id: 1 }];
    mockPrisma.fAQ.findMany.mockResolvedValue(faqs);

    const result = await repository.findAllFaqs();

    expect(mockPrisma.fAQ.findMany).toHaveBeenCalledWith();
    expect(result).toBe(faqs);
  });

  it("findById busca pelo id", async () => {
    const faq = { id: 1 };
    mockPrisma.fAQ.findUnique.mockResolvedValue(faq);

    const result = await repository.findById(1);

    expect(mockPrisma.fAQ.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(faq);
  });

  it("findByQuestion busca pela pergunta", async () => {
    const faq = { id: 1, question: "Q1" };
    mockPrisma.fAQ.findUnique.mockResolvedValue(faq);

    const result = await repository.findByQuestion("Q1");

    expect(mockPrisma.fAQ.findUnique).toHaveBeenCalledWith({ where: { question: "Q1" } });
    expect(result).toBe(faq);
  });

  it("create cria uma FAQ", async () => {
    const data = { question: "Q1", answer: "A1", category: "geral" };
    const created = { id: 1, ...data };
    mockPrisma.fAQ.create.mockResolvedValue(created);

    const result = await repository.create(data);

    expect(mockPrisma.fAQ.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(created);
  });

  it("update atualiza uma FAQ", async () => {
    const data = { answer: "Nova resposta" };
    const updated = { id: 1, question: "Q1", answer: "Nova resposta", category: "geral" };
    mockPrisma.fAQ.update.mockResolvedValue(updated);

    const result = await repository.update(1, data);

    expect(mockPrisma.fAQ.update).toHaveBeenCalledWith({ where: { id: 1 }, data });
    expect(result).toBe(updated);
  });

  it("delete remove uma FAQ", async () => {
    const deleted = { id: 1, question: "Q1", answer: "A1", category: "geral" };
    mockPrisma.fAQ.delete.mockResolvedValue(deleted);

    const result = await repository.delete(1);

    expect(mockPrisma.fAQ.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(deleted);
  });
});
