import { IUser } from "../../../domain layer/entities/User";
import { IAdminRepository } from "../../../infrastructure layer/database/repositories/adminRepo";

export class FetchUsersUseCase {
  constructor(private adminRepository: IAdminRepository) {}
  async execute(
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const result = this.adminRepository.fetchUsers(page, limit);
      if (!result) {
        throw new Error("Error fetching users");
      }
      return result;
    } catch (error) {
      return {
        users: [],
        total: 0,
      };
    }
  }
}
