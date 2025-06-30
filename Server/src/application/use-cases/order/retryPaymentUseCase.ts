import { IOrderRepository } from "../../../infrastructure layer/database/repositories/orderRepo";
import { IUser } from "../../../domain layer/entities/User";
import { IPaymentService } from "../../../infrastructure layer/services/razorpayServices";

export class RetryPaymentUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(orderId: string, user: IUser) {
    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const order = await this.orderRepo.findFailedOrderById(
      orderId,
      user._id.toString()
    );

    if (!order) {
      throw new Error("Order not found or already processed");
    }

    const newRazorpayOrder = await this.paymentService.createOrder({
      amount: order.amount * 100,
      currency: "INR",
    });

    order.orderId = newRazorpayOrder.id;
    order.paymentStatus = "Pending";
    order.status = "Pending";
    order.updatedAt = new Date();

    await this.orderRepo.updateOrder(order);

    return {
      orderId: newRazorpayOrder.id,
      amount: order.amount * 100,
    };
  }
}
