import type { CreateFaqDTO } from "../dto/create-faq.dto";
import { FaqRepository } from "../repositories/faq.repository";

export class FaqService {
  private repository: FaqRepository;

  constructor(repository: FaqRepository) {
    this.repository = repository;
  }

  list() {
    return this.repository.findAllFaqs();
  }

  create(data: CreateFaqDTO) {
    return this.repository.create(data);
  }
}