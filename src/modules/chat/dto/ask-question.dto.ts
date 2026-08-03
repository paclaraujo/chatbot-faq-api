import { z } from "zod";

export const askQuestionSchema = z.object({
  question: z.string().trim().min(1, "Pergunta é obrigatória"),
});

export type AskQuestionDTO = z.infer<typeof askQuestionSchema>;
