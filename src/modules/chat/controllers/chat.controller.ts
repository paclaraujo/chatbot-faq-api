import type { Request, Response } from "express";
import { ChatRepository } from "../repositories/chat.repository";
import { ChatService } from "../services/chat.service";

const repository = new ChatRepository();
const service = new ChatService(repository);

export class ChatController {
  static async ask(req: Request, res: Response) {
    try {
      const { question } = req.body;

      if (!question || !question.trim()) {
        throw new Error("Question is required");
      }

      const result = await service.ask({ question });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  static async history(_: Request, res: Response) {
    try {
      const history = await service.history();

      return res.status(200).json(history);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
