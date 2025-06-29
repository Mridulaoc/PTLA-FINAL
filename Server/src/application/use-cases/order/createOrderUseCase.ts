import { ICouponRepository } from "../../../infrastructure layer/database/repositories/couponRepo";
import { IOrderRepository } from "../../../infrastructure layer/database/repositories/orderRepo";
import { IPaymentService } from "../../../infrastructure layer/services/razorpayServices";
import { formatBillingAddress } from "../../../shared/utils/formatBillingAddress";

interface ICreateOrderParams {
  userId: string;
  amount: number;
  currency: string;
  billingAddress: any;
  subtotal: number;
  discount: number;
  tax: number;
  couponCode?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private couponRepo: ICouponRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(params: ICreateOrderParams): Promise<string> {
    const {
      userId,
      amount,
      currency,
      billingAddress,
      subtotal,
      discount,
      tax,
      couponCode,
    } = params;

    const items = await this.orderRepo.getCartItems(userId);

    let couponDetails;
    if (couponCode && userId) {
      const coupon = await this.couponRepo.validateCoupon(couponCode, userId);
      if (coupon) {
        couponDetails = {
          code: coupon.code,
          discountType: coupon.discountType as "fixed" | "percentage",
          discountValue: coupon.discountValue,
          expiryDate: coupon.expiryDate,
        };
      }
    }

    const razorpayOrder = await this.paymentService.createOrder({
      amount,
      currency,
    });
    if (!razorpayOrder?.id) throw new Error("Razorpay order creation failed");

    const formattedBilling = formatBillingAddress(billingAddress);

    await this.orderRepo.createOrder({
      orderId: razorpayOrder.id,
      amount: amount / 100,
      userId,
      items,
      billingAddress: formattedBilling,
      status: "Pending",
      paymentStatus: "Pending",
      subtotal,
      discount,
      tax,
      coupon: couponDetails,
    });

    return razorpayOrder.id;
  }
}
