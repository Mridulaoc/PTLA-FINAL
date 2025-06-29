import { IAdminRepository } from "../../../infrastructure layer/database/repositories/adminRepo";

export class GetAdminIdUseCase {
  constructor(private adminRepository: IAdminRepository) {}
  async execute(): Promise<string> {
    try {
      const adminId = await this.adminRepository.findAdminId();

      return adminId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to find admin id";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
