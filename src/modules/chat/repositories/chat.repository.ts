import { prisma } from "../../../database/prisma";

const SIMILARITY_THRESHOLD = 0.3;

interface FaqMatch {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface CreateInteractionData {
  question: string;
  matched: boolean;
  faqId: number | null;
}

export class ChatRepository {
  async findSimilarFaq(question: string) {
    const [match] = await prisma.$queryRaw<FaqMatch[]>`
      SELECT id, question, answer, category
      FROM "FAQ"
      WHERE similarity(question, ${question}) > ${SIMILARITY_THRESHOLD}
      ORDER BY similarity(question, ${question}) DESC
      LIMIT 1
    `;

    return match ?? null;
  }

  async createInteraction(data: CreateInteractionData) {
    return prisma.interaction.create({ data });
  }

  async findHistory() {
    return prisma.interaction.findMany({
      orderBy: { createdAt: "desc" },
      include: { faq: true },
    });
  }
}
