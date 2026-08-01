import type { CreateFaqDTO, UpdateFaqDTO } from "../dto/create-faq.dto";
import { FaqRepository } from "../repositories/faq.repository";

export class FaqService {
  private repository: FaqRepository;

  constructor(repository: FaqRepository) {
    this.repository = repository;
  }

  async list() {
    return await this.repository.findAllFaqs();
  }

  async create(data: CreateFaqDTO) {
    return await this.repository.create(data);
  }

  async update(id: number, data: UpdateFaqDTO) {
    const faq = await this.repository.findById(id);

    if (!faq) {
      throw new Error("FAQ não encontrado");
    }

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    const faq = await this.repository.findById(id);

    if (!faq) {
      throw new Error("FAQ não encontrado");
    }

    return this.repository.delete(id);
  }
}