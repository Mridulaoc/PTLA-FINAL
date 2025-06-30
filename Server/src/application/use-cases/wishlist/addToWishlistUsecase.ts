import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class AddToWishlistUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(
    userId: string,
    itemId: string,
    itemType: "Course" | "Bundle"
  ): Promise<IUser | null> {
    try {
      if (!itemId || !itemType) {
        throw new Error("Item ID and type are required");
      }

      if (!["Course", "Bundle"].includes(itemType)) {
        throw new Error("Invalid item type");
      }

      const user = await this.userRepository.addToWishlist(
        userId,
        itemId,
        itemType
      );

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
