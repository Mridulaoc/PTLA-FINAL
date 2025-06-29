import { IUser } from "../../../domain layer/entities/User";
import { BundleModel } from "../../../infrastructure layer/database/models/courseBundleModel";
import { UserModel } from "../../../infrastructure layer/database/models/userModel";
import { ICourseBundleRepository } from "../../../infrastructure layer/database/repositories/courseBundleRepo";
import { IOrderRepository } from "../../../infrastructure layer/database/repositories/orderRepo";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";
import { IPaymentService } from "../../../infrastructure layer/services/razorpayServices";

export class RequestRefundUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private bundleRepo: ICourseBundleRepository,
    private userRepo: IUserRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(orderId: string, user: IUser) {
    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const order = await this.orderRepo.findOrderByUserId(
      orderId,
      user._id.toString()
    );
    if (!order) throw new Error("Order not found");

    if (order.paymentStatus !== "Payment Successfull") {
      throw new Error("Only successful payments can be refunded");
    }

    const hasBundleItem = order.items?.some(
      (item) => item.itemType === "Bundle"
    );
    if (!hasBundleItem) {
      throw new Error("Only bundle purchases are eligible for refund");
    }

    const orderDate = new Date(order.createdAt!);
    const currentDate = new Date();
    const refundWindowMs = 7 * 24 * 60 * 60 * 1000;

    if (currentDate.getTime() - orderDate.getTime() > refundWindowMs) {
      throw new Error("Refund window has expired (7 days from purchase)");
    }

    order.status = "Refund Requested";

    if (order.paymentId) {
      const refund = await this.paymentService.refund(order.paymentId, {
        amount: order.amount * 100,
        notes: {
          orderId: order.orderId,
          reason: "Customer requested refund",
        },
      });

      order.refundId = refund.id;
      order.refundStatus = "Initiated";
    }

    await this.orderRepo.updateOrder(order);

    for (const item of order.items!) {
      if (item.itemType === "Bundle") {
        await this.userRepo.removeEnrolledBundle(
          user._id.toString(),
          item.itemId.toString()
        );
        const bundle = await this.bundleRepo.findBundleById(
          item.itemId.toString()
        );
        if (bundle) {
          await this.userRepo.removeEnrolledCoursesFromBundle(
            user._id.toString(),
            item.itemId.toString(),
            bundle.courses.map((courseId) => courseId.toString())
          );
        }
      }
    }

    return order;
  }
}
