import { IOrder } from "../../../domain/entities/order";
import { IOrderRepository } from "../../../infrastructure/database/repositories/orderRepo";

export class GetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const result = await this.orderRepository.findAllOrders(page, limit);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
