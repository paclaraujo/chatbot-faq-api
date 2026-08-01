import { prisma } from "../../../database/prisma";

interface CategoryCount {
  category: string;
  count: number;
}

interface UnansweredQuestion {
  question: string;
  count: number;
  lastAskedAt: Date;
}

interface TimelinePoint {
  date: Date;
  count: number;
}

export class AnalyticsRepository {
  async countByMatched() {
    return prisma.interaction.groupBy({
      by: ["matched"],
      _count: true,
    });
  }

  async topFaqs(limit: number) {
    const grouped = await prisma.interaction.groupBy({
      by: ["faqId"],
      where: { matched: true, faqId: { not: null } },
      _count: true,
    });

    const top = grouped
      .sort((a, b) => b._count - a._count)
      .slice(0, limit);

    const faqs = await prisma.fAQ.findMany({
      where: { id: { in: top.map((g) => g.faqId as number) } },
    });

    return top.map((g) => {
      const faq = faqs.find((f) => f.id === g.faqId);

      return {
        faqId: g.faqId,
        question: faq?.question ?? "",
        category: faq?.category ?? "",
        count: g._count,
      };
    });
  }

  async unansweredQuestions(limit: number) {
    return prisma.$queryRaw<UnansweredQuestion[]>`
      SELECT LOWER(TRIM(question)) AS question, COUNT(*)::int AS count, MAX("createdAt") AS "lastAskedAt"
      FROM "Interaction"
      WHERE matched = false
      GROUP BY LOWER(TRIM(question))
      ORDER BY count DESC
      LIMIT ${limit}
    `;
  }

  async distributionByCategory() {
    return prisma.$queryRaw<CategoryCount[]>`
      SELECT COALESCE(f.category, 'Não categorizado') AS category, COUNT(*)::int AS count
      FROM "Interaction" i
      LEFT JOIN "FAQ" f ON f.id = i."faqId"
      GROUP BY category
      ORDER BY count DESC
    `;
  }

  async timeline(days: number) {
    return prisma.$queryRaw<TimelinePoint[]>`
      SELECT date_trunc('day', "createdAt") AS date, COUNT(*)::int AS count
      FROM "Interaction"
      WHERE "createdAt" >= NOW() - make_interval(days => ${days})
      GROUP BY date
      ORDER BY date ASC
    `;
  }
}
