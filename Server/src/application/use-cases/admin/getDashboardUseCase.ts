import { IDashboardStats } from "../../../domain layer/entities/dashboard";
import { IDashboardRepository } from "../../../infrastructure layer/database/repositories/dashboardRepo";

export class GetDashboardUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<IDashboardStats> {
    try {
      const stats = await this.dashboardRepository.getDashboardStats();

      if (!stats) {
        throw new Error("Could not get stats");
      }

      return stats;
    } catch (error) {
      throw error;
    }
  }
}
