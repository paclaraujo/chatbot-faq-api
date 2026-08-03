import type { Request, Response } from "express";
import { ChatRepository } from "../repositories/chat.repository";
import { ChatService } from "../services/chat.service";
import type { AskQuestionDTO } from "../dto/ask-question.dto";

const repository = new ChatRepository();
const service = new ChatService(repository);

export class ChatController {
  static async ask(req: Request, res: Response) {
    const result = await service.ask(req.body as AskQuestionDTO);

    return res.status(200).json(result);
  }

  static async history(_req: Request, res: Response) {
    const history = await service.history();

    return res.status(200).json(history);
  }
}
