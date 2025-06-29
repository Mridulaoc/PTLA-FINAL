import Razorpay from "razorpay";
import crypto from "crypto";
import { instance } from "../../config/razorpayConfig";

type FetchPaymentReturnType = Awaited<
  ReturnType<typeof instance.payments.fetch>
>;

export interface IRazorpayOrderOptions {
  amount: number;
  currency: string;
}

export interface IRazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface IRazorpayAuthInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

type RazorpayRefundResponse = Awaited<
  ReturnType<Razorpay["payments"]["refund"]>
>;

export interface IPaymentService {
  createOrder(options: IRazorpayOrderOptions): Promise<IRazorpayOrderResponse>;
  verifySignature(data: IRazorpayAuthInput): boolean;
  fetchPayment(paymentId: string): Promise<any>;
  refund(
    paymentId: string,
    data: { amount: number; notes?: any }
  ): Promise<any>;
}

export class RazorpayService implements IPaymentService {
  async createOrder(
    options: IRazorpayOrderOptions
  ): Promise<IRazorpayOrderResponse> {
    try {
      const order = await instance.orders.create({
        amount: Math.round(options.amount),
        currency: options.currency,
      });

      return order as IRazorpayOrderResponse;
    } catch (error) {
      console.error("Razorpay error", error);
      throw new Error("Failed to create payment order");
    }
  }

  verifySignature(data: IRazorpayAuthInput): boolean {
    const body = `${data.orderId}|${data.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(body)
      .digest("hex");
    return data.signature === expectedSignature;
  }

  async fetchPayment(paymentId: string) {
    return await instance.payments.fetch(paymentId);
  }

  async refund(
    paymentId: string,
    data: { amount: number; notes?: any }
  ): Promise<any> {
    try {
      const refund = await instance.payments.refund(paymentId, data);
      return refund;
    } catch (error) {
      console.error("Refund error", error);
      throw new Error("Failed to initiate refund");
    }
  }
}
