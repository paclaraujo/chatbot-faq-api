import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginDTO } from "../dto/login.dto";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthService {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async login(data: LoginDTO) {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new Error("Credenciais inválidas");
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      "8h") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn }
    );

    return { token };
  }
}
