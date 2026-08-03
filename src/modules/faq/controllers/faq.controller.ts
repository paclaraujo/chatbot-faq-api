import type { Request, Response } from "express";
import { FaqRepository } from "../repositories/faq.repository";
import { FaqService } from "../services/faq.service";
import type { CreateFaqDTO, UpdateFaqDTO } from "../dto/create-faq.dto";

const repository = new FaqRepository();
const service = new FaqService(repository);

export class FaqController {
  static async list(_req: Request, res: Response) {
    const faqs = await service.list();

    return res.status(200).json(faqs);
  }

  static async create(req: Request, res: Response) {
    const faq = await service.create(req.body as CreateFaqDTO);

    return res.status(201).json(faq);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const faq = await service.update(id, req.body as UpdateFaqDTO);

    return res.status(200).json(faq);
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await service.delete(id);

    return res.sendStatus(204);
  }
}
