import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class FetchFromCartUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.getCart(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch cart");
    }
  }
}
