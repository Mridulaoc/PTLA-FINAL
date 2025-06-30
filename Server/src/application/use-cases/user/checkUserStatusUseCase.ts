import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";
import {
  IJwtService,
  JwtPayloadExtended,
} from "../../../infrastructure/services/jwtService";

export class CheckUserStatusUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService
  ) {}

  async execute(token: string): Promise<{ isBlocked: boolean }> {
    const decoded = this.jwtService.verifyToken(token) as JwtPayloadExtended;

    const user = await this.userRepository.findById(decoded.userId!);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isBlocked) {
      throw new Error("Your account has been blocked. Please contact support.");
    }

    return { isBlocked: false };
  }
}
