import type { Request, Response } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import type { LoginDTO } from "../dto/login.dto";

const repository = new AuthRepository();
const service = new AuthService(repository);

export class AuthController {
  static async login(req: Request, res: Response) {
    const result = await service.login(req.body as LoginDTO);

    return res.status(200).json(result);
  }
}
