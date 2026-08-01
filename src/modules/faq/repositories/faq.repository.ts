import { prisma } from "../../../database/prisma";
import type { CreateFaqDTO } from "../dto/create-faq.dto";

interface Faq extends CreateFaqDTO {
  id: number;
}

export class FaqRepository {
  async findAllFaqs() {
    const faqs = await prisma.fAQ.findMany();

    return JSON.stringify(faqs)
  }
  
  create(data: CreateFaqDTO) {
    return prisma.fAQ.create({
      data
    })
  }
}