import { IUser } from "../../../domain layer/entities/User";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      return null;
    }
  }
}
