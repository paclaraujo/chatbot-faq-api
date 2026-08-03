import type { CreateFaqDTO, UpdateFaqDTO } from "../dto/create-faq.dto";
import { FaqRepository } from "../repositories/faq.repository";
import { ConflictError, NotFoundError } from "../../../shared/errors";

export class FaqService {
  private repository: FaqRepository;

  constructor(repository: FaqRepository) {
    this.repository = repository;
  }

  async list() {
    return await this.repository.findAllFaqs();
  }

  async create(data: CreateFaqDTO) {
    const existing = await this.repository.findByQuestion(data.question);

    if (existing) {
      throw new ConflictError("Já existe uma pergunta cadastrada com esse mesmo texto");
    }

    return await this.repository.create(data);
  }

  async update(id: number, data: UpdateFaqDTO) {
    const faq = await this.repository.findById(id);

    if (!faq) {
      throw new NotFoundError("FAQ não encontrado");
    }

    if (data.question) {
      const existing = await this.repository.findByQuestion(data.question);

      if (existing && existing.id !== id) {
        throw new ConflictError("Já existe uma pergunta cadastrada com esse mesmo texto");
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    const faq = await this.repository.findById(id);

    if (!faq) {
      throw new NotFoundError("FAQ não encontrado");
    }

    return this.repository.delete(id);
  }
}