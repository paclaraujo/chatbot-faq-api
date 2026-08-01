import type { Request, Response } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";

const repository = new AuthRepository();
const service = new AuthService(repository);

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios",
      });
    }

    try {
      const result = await service.login({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        message: (error as Error).message,
      });
    }
  }
}
