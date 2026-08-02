import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatRepository } from "../repositories/chat.repository";
import { ChatService } from "./chat.service";

function createRepositoryMock() {
  return {
    findSimilarFaq: vi.fn(),
    createInteraction: vi.fn(),
    findHistory: vi.fn(),
  } as unknown as ChatRepository;
}

describe("ChatService", () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: ChatService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new ChatService(repository);
  });

  describe("ask", () => {
    it("returns the matching answer and records the interaction as a match", async () => {
      const match = { id: 1, question: "Como funciona?", answer: "Assim.", category: "geral" };
      vi.mocked(repository.findSimilarFaq).mockResolvedValue(match);
      vi.mocked(repository.createInteraction).mockResolvedValue({} as never);

      const result = await service.ask({ question: "como funciona" });

      expect(repository.createInteraction).toHaveBeenCalledWith({
        question: "como funciona",
        matched: true,
        faqId: 1,
      });
      expect(result).toEqual({
        matched: true,
        answer: "Assim.",
        faq: { id: 1, question: "Como funciona?", category: "geral" },
      });
    });

    it("returns the default message and records no match when no similar FAQ is found", async () => {
      vi.mocked(repository.findSimilarFaq).mockResolvedValue(null as never);
      vi.mocked(repository.createInteraction).mockResolvedValue({} as never);

      const result = await service.ask({ question: "pergunta desconhecida" });

      expect(repository.createInteraction).toHaveBeenCalledWith({
        question: "pergunta desconhecida",
        matched: false,
        faqId: null,
      });
      expect(result).toEqual({
        matched: false,
        answer: null,
        message:
          "Não encontramos uma resposta para essa pergunta. Tente reformulá-la ou entre em contato com o suporte.",
      });
    });
  });

  describe("history", () => {
    it("returns the history from the repository", async () => {
      const history = [{ id: 1, question: "Q", matched: true }];
      vi.mocked(repository.findHistory).mockResolvedValue(history as never);

      const result = await service.history();

      expect(result).toBe(history);
    });
  });
});
