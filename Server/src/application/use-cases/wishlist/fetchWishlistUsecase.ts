import { IUser } from "../../../domain layer/entities/User";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class FetchWishlistUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const user = await this.userRepository.getWishlist(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch wishlist");
    }
  }
}
