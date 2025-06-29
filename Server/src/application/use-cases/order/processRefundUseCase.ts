import { IOrder } from "../../../domain layer/entities/order";
import { IOrderRepository } from "../../../infrastructure layer/database/repositories/orderRepo";

export class ProcessRefundUseCase {
  constructor(private orderRepository: IOrderRepository) {}
  async execute(orderId: string): Promise<IOrder> {
    try {
      const order = await this.orderRepository.updateOrderStatus(orderId);
      if (!order) {
        throw new Error("Could not update the order");
      }
      return order;
    } catch (error) {
      throw error;
    }
  }
}
