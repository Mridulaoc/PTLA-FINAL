import { ObjectId } from "mongoose";
import { IOrder } from "../../../domain/entities/order";
import { UserModel } from "../models/userModel";
import { OrderModel } from "../models/orderModel";

interface ICartItem {
  itemId: string | ObjectId;
  itemType: "Course" | "Bundle";
  title: string;
  price: number;
}

export interface IOrderRepository {
  getCartItems(userId: string): Promise<ICartItem[] | null>;
  createOrder(order: Partial<IOrder>): Promise<void>;
  updateOnSuccess(orderId: string): Promise<IOrder | null>;
  updateOnFailure(orderId: string): Promise<IOrder | null>;
  findAllOrders(
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }>;
  updateOrderStatus(orderId: string): Promise<IOrder>;
  findOrdersByDateRange(
    startDate: Date,
    endDate: Date,
    status: string,
    paymentStatus: string
  ): Promise<IOrder[]>;
  findByOrderId(orderId: string): Promise<IOrder | null>;
  markCancelled(orderId: string): Promise<void>;
  markCompleted(
    order: any,
    paymentId: string,
    signature: string
  ): Promise<void>;
  findOrderByUserId(userId: string, orderId: string): Promise<IOrder | null>;
  findFailedOrderById(orderId: string, userId: string): Promise<IOrder | null>;
  updateOrder(order: IOrder): Promise<void>;
}

export class OrderRepository implements IOrderRepository {
  async getCartItems(userId: string): Promise<ICartItem[] | null> {
    try {
      const user = await UserModel.findById(userId).populate({
        path: "cart.item",
        select: "_id title price discountedPrice",
      });

      if (!user) {
        throw new Error(" User not found");
      }
      if (!user.cart || user.cart.length === 0) {
        return [];
      }
      const items = user.cart.map((cartItem) => {
        const itemDoc = cartItem.item as any;
        return {
          itemId: itemDoc._id,
          itemType: cartItem.itemType,
          title: itemDoc.title,
          price:
            cartItem.itemType === "Bundle"
              ? itemDoc.discountedPrice
              : itemDoc.price,
        };
      });
      return items;
    } catch (error) {
      return [];
    }
  }

  async createOrder(order: Partial<IOrder>): Promise<void> {
    try {
      const newOrder = await OrderModel.create({
        ...order,
        subtotal: order.subtotal || order.amount,
        discount: order.discount || 0,
        tax: order.tax || 0,
      });
      if (!newOrder) {
        throw new Error("Could not create order");
      }
      await newOrder.save();
    } catch (error) {
      console.log(error);
    }
  }
  async updateOnSuccess(orderId: string): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;
      order.status = "Completed";
      order.paymentStatus = "Payment Successfull";
      order.updatedAt = new Date();
      return await order.save();
    } catch (error) {
      return null;
    }
  }

  async updateOnFailure(orderId: string): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;
      order.status = "Failed";
      order.paymentStatus = "Payment Failed";
      order.updatedAt = new Date();
      return await order.save();
    } catch (error) {}
    return null;
  }

  async findAllOrders(
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const orders = await OrderModel.find()
        .populate("userId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await OrderModel.countDocuments();
      return { orders, total };
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId: string): Promise<IOrder> {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) {
        throw new Error("Could not find order with the given order id");
      }
      order.status = "Request Accepted";
      order.paymentStatus = "Refunded";
      order.updatedAt = new Date();
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  async findOrdersByDateRange(
    startDate: Date,
    endDate: Date,
    status: string,
    paymentStatus: string
  ): Promise<IOrder[]> {
    try {
      return await OrderModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status,
        paymentStatus,
      });
    } catch (error) {
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ orderId });
  }

  async markCancelled(orderId: string) {
    const order = await OrderModel.findOne({ orderId });
    if (order) {
      order.status = "Cancelled";
      order.paymentStatus = "Payment Cancelled";
      order.updatedAt = new Date();
      await order.save();
    }
  }
  async markCompleted(order: any, paymentId: string, signature: string) {
    order.status = "Completed";
    order.paymentStatus = "Payment Successful";
    order.paymentId = paymentId;
    order.paymentSignature = signature;
    order.updatedAt = new Date();
    await order.save();
  }

  async findOrderByUserId(
    userId: string,
    orderId: string
  ): Promise<IOrder | null> {
    return await OrderModel.findOne({
      userId,
      orderId,
    });
  }

  async findFailedOrderById(
    orderId: string,
    userId: string
  ): Promise<IOrder | null> {
    const order = await OrderModel.findOne({
      orderId,
      userId,
      paymentStatus: "Payment Failed",
    });
    return order;
  }

  async updateOrder(order: IOrder): Promise<void> {
    await OrderModel.updateOne({ _id: order._id }, order);
  }
}
