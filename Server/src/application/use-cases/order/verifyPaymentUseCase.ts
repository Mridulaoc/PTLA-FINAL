import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";
import { IOrderRepository } from "../../../infrastructure/database/repositories/orderRepo";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";
import { IEmailService } from "../../../infrastructure/services/emailService";
import { IPaymentService } from "../../../infrastructure/services/razorpayServices";
import { HandleEnrollmentAfterPaymentUseCase } from "../userEnrollment/handleEnrollmentAfterPaymentUseCase";

interface IRazorpayPaymentVerificationBody {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export class VerifyPaymentUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private couponRepo: ICouponRepository,
    private userRepo: IUserRepository,
    private paymentService: IPaymentService,
    private emailService: IEmailService,
    private handleEnrollmentUseCase: HandleEnrollmentAfterPaymentUseCase
  ) {}
  async execute(body: IRazorpayPaymentVerificationBody) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const order = await this.orderRepo.findByOrderId(body.razorpay_order_id);

      if (order && order.status === "Pending") {
        await this.orderRepo.markCancelled(order.orderId);
        return {
          success: false,
          message: "Invalid payment details provided",
          redirectTo: `/payment-cancelled?orderId=${order.orderId}`,
        };
      }
    }

    const isAuthentic = this.paymentService.verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isAuthentic) {
      await this.orderRepo.updateOnFailure(razorpay_order_id);
      return {
        success: false,
        message: "Signature verification failed",
        redirectTo: `/payment-failed?orderId=${razorpay_order_id}&error=signature_verification_failed`,
      };
    }

    const paymentDetails = await this.paymentService.fetchPayment(
      razorpay_payment_id
    );
    if (paymentDetails.status !== "captured") {
      await this.orderRepo.updateOnFailure(razorpay_order_id);
      return {
        success: false,
        message: "Payment not captured",
        redirectTo: `/payment-failed?orderId=${razorpay_order_id}&error=payment_not_captured`,
      };
    }

    const order = await this.orderRepo.findByOrderId(razorpay_order_id);
    if (!order || order.status !== "Pending") {
      return {
        success: false,
        message: "Order not found or not in pending state",
        redirectTo: `/payment-cancelled?orderId=${razorpay_order_id}`,
      };
    }

    await this.orderRepo.markCompleted(
      order,
      razorpay_payment_id,
      razorpay_signature
    );

    if (order.coupon && order.coupon.code) {
      await this.couponRepo.markCouponAsUsed(
        order.userId.toString(),
        order.coupon?.code
      );
    }
    await this.handleEnrollmentUseCase.execute(order);
    await this.userRepo.clearCart(order.userId.toString());

    await this.emailService.sendOrderConfirmationEmail(
      order,
      razorpay_payment_id
    );

    return {
      success: true,
      message: "Payment verified successfully",
      redirectTo: `/paymentSuccess?reference=${razorpay_payment_id}`,
    };
  }
}
