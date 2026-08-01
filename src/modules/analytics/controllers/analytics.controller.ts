import type { Request, Response } from "express";
import { AnalyticsRepository } from "../repositories/analytics.repository";
import { AnalyticsService } from "../services/analytics.service";

const repository = new AnalyticsRepository();
const service = new AnalyticsService(repository);

export class AnalyticsController {
  static async dashboard(req: Request, res: Response) {
    try {
      const { topLimit, unansweredLimit, timelineDays } = req.query;

      const result = await service.dashboard({
        topLimit: topLimit ? Number(topLimit) : undefined,
        unansweredLimit: unansweredLimit ? Number(unansweredLimit) : undefined,
        timelineDays: timelineDays ? Number(timelineDays) : undefined,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
