import { IUser } from "../../../domain layer/entities/User";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      const updatedUser = await this.userRepository.updateUser(userId, data);
      if (!updatedUser) {
        throw new Error("Could not update user");
      }
      return updatedUser;
    } catch (error) {}
    return null;
  }
}
