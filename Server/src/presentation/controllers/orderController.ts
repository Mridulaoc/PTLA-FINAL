import { Request, Response } from "express";
import { IUser } from "../../domain/entities/User";
import { CreateOrderUseCase } from "../../application/use-cases/order/createOrderUseCase";
import { VerifyPaymentUseCase } from "../../application/use-cases/order/verifyPaymentUseCase";
import { ConfirmPaymentUseCase } from "../../application/use-cases/order/confirmPaymentUseCase";
import { CancelPaymentUseCase } from "../../application/use-cases/order/cancelPaymentUseCase";
import { FetchUserOrdersUseCase } from "../../application/use-cases/order/fetchUserOrdersUseCase";
import { RetryPaymentUseCase } from "../../application/use-cases/order/retryPaymentUseCase";
import { RequestRefundUseCase } from "../../application/use-cases/order/requestRefundUseCase";
import { ProcessRefundUseCase } from "../../application/use-cases/order/processRefundUseCase";
import { GetAllOrdersUseCase } from "../../application/use-cases/order/getAllOrdersUsecase";
import { GetSalesReportUseCase } from "../../application/use-cases/order/getSalesReportUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private verifyPaymentUseCase: VerifyPaymentUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private cancelPaymentUseCase: CancelPaymentUseCase,
    private fetchUserOrdersUseCase: FetchUserOrdersUseCase,
    private retryPaymentUseCase: RetryPaymentUseCase,
    private requestRefundUseCase: RequestRefundUseCase,
    private processRefundUseCase: ProcessRefundUseCase,
    private getAllOrdersUseCase: GetAllOrdersUseCase,
    private getSalesReportUseCase: GetSalesReportUseCase
  ) {}

  getKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const razorpayApiKey = process.env.RAZORPAY_API_KEY;

      if (!razorpayApiKey) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: ResponseMessages.RAZORPAY_KEY_MISSING,
        });
        return;
      }
      res.status(HttpStatus.OK).json({ key: razorpayApiKey });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: HttpStatus.UNAUTHORIZED });
        return;
      }

      console.log("creating order");
      const orderId = await this.createOrderUseCase.execute({
        userId: user._id.toString(),
        amount: req.body.amount,
        currency: req.body.currency,
        billingAddress: req.body.billingAddress,
        subtotal: req.body.subtotal,
        discount: req.body.discount,
        tax: req.body.tax,
        couponCode: req.body.couponCode,
      });

      console.log("Order created");

      res.status(HttpStatus.OK).json({ orderId });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        res.status(HttpStatus.BAD_REQUEST).json({
          error: errorMessage || ResponseMessages.ORDER_CREATION_FAILED,
        });
      }
    }
  };

  verifyAndSaveOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("verifying payment");
      const result = await this.verifyPaymentUseCase.execute(req.body);
      console.log("Payment verified");

      res.status(HttpStatus.OK).json({
        success: result.success,
        message: result.message,
        redirectTo: result.redirectTo,
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  };

  confirmPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.body;
      await this.confirmPaymentUseCase.execute(orderId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseMessages.PAYMENT_CONFIRMATION_ERROR,
      });
    }
  };

  cancelPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, reason } = req.body;
      const user = req.user as IUser;
      const result = await this.cancelPaymentUseCase.execute(
        user,
        orderId,
        reason
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.ORDER_CANCELLED(reason),
        order: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseMessages.INTERNAL_SERVER_ERROR,
      });
    }
  };

  getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
      }
      const userId = user._id.toString();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { orders, total } = await this.fetchUserOrdersUseCase.execute(
        page,
        limit,
        userId
      );
      res.status(HttpStatus.OK).json({ orders, total, page, limit });
    } catch (error) {
      res.status(500).json({ message: ResponseMessages.ORDER_FETCH_ERROR });
    }
  };

  retryPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.body;
      const user = req.user as IUser;

      const result = await this.retryPaymentUseCase.execute(orderId, user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ResponseMessages.RETRY_PAYMENT_ERROR;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  };

  requestRefund = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.params;
      const user = req.user as IUser;

      const order = await this.requestRefundUseCase.execute(orderId, user);

      res.status(HttpStatus.OK).json(order);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ResponseMessages.REFUND_REQUEST_ERROR;
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  processRefund = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.body;

      const order = await this.processRefundUseCase.execute(orderId);
      if (!order) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.ORDER_NOT_FOUND });
      }

      res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseMessages.REFUND_PROCESS_ERROR,
      });
    }
  };

  getALLOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.getAllOrdersUseCase.execute(page, limit);
      if (!result) {
        throw new Error(ResponseMessages.COULD_NOT_FETCH_ORDERS);
      }
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getSalesReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.DATE_INVALID });
        return;
      }

      const salesReport = await this.getSalesReportUseCase.execute(start, end);

      res.status(HttpStatus.OK).json(salesReport);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SALES_REPORT_ERROR });
    }
  };
}
