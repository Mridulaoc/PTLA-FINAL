import { IUser } from "../../../domain/entities/User";
import { IOrderRepository } from "../../../infrastructure/database/repositories/orderRepo";

export class CancelPaymentUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(user: IUser, orderId: string, reason: string) {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const order = await this.orderRepo.findOrderByUserId(
      orderId,
      user._id.toString()
    );

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "Pending" && order.paymentStatus !== "Pending") {
      throw new Error(
        `Cannot update order with status: ${order.status}. Only pending orders can be updated.`
      );
    }

    if (reason === "payment_failed") {
      order.status = "Failed";
      order.paymentStatus = "Payment Failed";
    } else {
      order.status = "Cancelled";
      order.paymentStatus = "Payment Cancelled";
    }

    return {
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
    };
  }
}
