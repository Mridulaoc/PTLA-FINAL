import { IUser } from "../../../domain layer/entities/User";
import { IAdminRepository } from "../../../infrastructure layer/database/repositories/adminRepo";

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
