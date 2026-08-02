import { prisma } from "../../../database/prisma";
import type { CreateFaqDTO, UpdateFaqDTO } from "../dto/create-faq.dto";

// interface Faq extends CreateFaqDTO {
//   id: number;
// }

export class FaqRepository {
  async findAllFaqs() {
    return await prisma.fAQ.findMany();
  }

  async findById(id: number) {
    return prisma.fAQ.findUnique({
      where: {
        id,
      },
    });
  }

  async findByQuestion(question: string) {
    return prisma.fAQ.findUnique({
      where: {
        question,
      },
    });
  }


  async create(data: CreateFaqDTO) {
    return await prisma.fAQ.create({
      data
    })
  }

  async update(id: number, data: UpdateFaqDTO) {
    return prisma.fAQ.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    return prisma.fAQ.delete({
      where: {
        id,
      },
    });
  }
}