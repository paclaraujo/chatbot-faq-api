import { z } from "zod";

export const dashboardQuerySchema = z.object({
  topLimit: z.coerce.number().int().positive().optional(),
  unansweredLimit: z.coerce.number().int().positive().optional(),
  timelineDays: z.coerce.number().int().positive().optional(),
});

export type DashboardQueryDTO = z.infer<typeof dashboardQuerySchema>;
