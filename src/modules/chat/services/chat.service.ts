import type { AskQuestionDTO } from "../dto/ask-question.dto";
import { ChatRepository } from "../repositories/chat.repository";

const NOT_FOUND_MESSAGE =
  "Não encontramos uma resposta para essa pergunta. Tente reformulá-la ou entre em contato com o suporte.";

export class ChatService {
  private repository: ChatRepository;

  constructor(repository: ChatRepository) {
    this.repository = repository;
  }

  async ask(data: AskQuestionDTO) {
    const match = await this.repository.findSimilarFaq(data.question);

    await this.repository.createInteraction({
      question: data.question,
      matched: !!match,
      faqId: match?.id ?? null,
    });

    if (!match) {
      return {
        matched: false,
        answer: null,
        message: NOT_FOUND_MESSAGE,
      };
    }

    return {
      matched: true,
      answer: match.answer,
      faq: {
        id: match.id,
        question: match.question,
        category: match.category,
      },
    };
  }

  async history() {
    return this.repository.findHistory();
  }
}
