import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(1, "Pergunta é obrigatória"),
  answer: z.string().trim().min(1, "Resposta é obrigatória"),
  category: z.string().trim().min(1, "Categoria é obrigatória"),
});

export const updateFaqSchema = createFaqSchema.partial();

export const faqIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Id inválido"),
});

export type CreateFaqDTO = z.infer<typeof createFaqSchema>;
export type UpdateFaqDTO = z.infer<typeof updateFaqSchema>;
