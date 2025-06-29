import { IUser } from "../../domain layer/entities/User";
import { IUserRepository } from "../../infrastructure layer/database/repositories/userRepo";

export class ToggleBlockUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.isBlocked = !user.isBlocked;
      const updatedUser = this.userRepository.update(user);
      if (!updatedUser) {
        throw new Error("Could not update user");
      }
      return updatedUser;
    } catch (error) {
      return null;
    }
  }
}
