import type { DashboardQueryDTO } from "../dto/dashboard-query.dto";
import { AnalyticsRepository } from "../repositories/analytics.repository";

const DEFAULT_TOP_LIMIT = 5;
const DEFAULT_UNANSWERED_LIMIT = 5;
const DEFAULT_TIMELINE_DAYS = 30;

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor(repository: AnalyticsRepository) {
    this.repository = repository;
  }

  async dashboard(query: DashboardQueryDTO) {
    const topLimit = query.topLimit ?? DEFAULT_TOP_LIMIT;
    const unansweredLimit = query.unansweredLimit ?? DEFAULT_UNANSWERED_LIMIT;
    const timelineDays = query.timelineDays ?? DEFAULT_TIMELINE_DAYS;

    const [counts, topQuestions, unanswered, byCategory, timeline] =
      await Promise.all([
        this.repository.countByMatched(),
        this.repository.topFaqs(topLimit),
        this.repository.unansweredQuestions(unansweredLimit),
        this.repository.distributionByCategory(),
        this.repository.timeline(timelineDays),
      ]);

    const totalMatched = counts.find((c) => c.matched)?._count ?? 0;
    const totalUnmatched = counts.find((c) => !c.matched)?._count ?? 0;
    const totalInteractions = totalMatched + totalUnmatched;

    return {
      totalInteractions,
      totalMatched,
      totalUnmatched,
      matchRate: totalInteractions > 0 ? totalMatched / totalInteractions : 0,
      topQuestions,
      unanswered,
      byCategory,
      timeline,
    };
  }
}
