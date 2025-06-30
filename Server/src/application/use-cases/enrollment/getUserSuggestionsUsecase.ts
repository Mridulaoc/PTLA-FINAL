import { IUser } from "../../../domain/entities/User";
import { IAdminRepository } from "../../../infrastructure/database/repositories/adminRepo";

export class GetUserSuggestionsUsecase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(query: string): Promise<IUser[] | null> {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Invalid query");
      }
      const suggestions = await this.adminRepository.fetchUserSuggestions(
        query
      );
      return suggestions;
    } catch (error) {
      return null;
    }
  }
}
