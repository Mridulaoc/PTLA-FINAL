import { IOrder } from "../../../domain layer/entities/order";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class FetchUserOrdersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    page: number,
    limit: number,
    userId: string
  ): Promise<{ orders: IOrder[] | null; total: number }> {
    try {
      const result = await this.userRepository.fetchUserOrders(
        page,
        limit,
        userId
      );
      if (!result) {
        throw new Error("Error fetching orders");
      }
      return result;
    } catch (error) {
      return {
        orders: [],
        total: 0,
      };
    }
  }
}
