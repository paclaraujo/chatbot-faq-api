import type { Request, Response } from "express";
import { FaqRepository } from "../repositories/faq.repository";
import { FaqService } from "../services/faq.service";

const repository = new FaqRepository();
const service = new FaqService(repository);

export class FaqController {
  static async list(_: Request, res: Response) {
    try {
      const faqs = await service.list();

      return res.status(200).json(faqs);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
    const data = req.body 
      
    if (!data.question || !data.question.trim()) {
      throw new Error("Question is required");
    }

    if (!data.answer || !data.answer.trim()) {
      throw new Error("Answer is required");
    }

    if (!data.category || !data.category.trim()) {
      throw new Error("Category is required");
    }
      const faq = await service.create(data);

      return res.status(201).json(faq);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;

    const faq = await service.update(
      +id,
      req.body
    );

    return res.status(200).json(faq);
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await service.delete(+id);

      return res.sendStatus(204);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}