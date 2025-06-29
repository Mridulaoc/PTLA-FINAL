import { IOrderRepository } from "../../../infrastructure layer/database/repositories/orderRepo";

export class ConfirmPaymentUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<void> {
    await this.orderRepository.updateOnSuccess(orderId);
  }
}
