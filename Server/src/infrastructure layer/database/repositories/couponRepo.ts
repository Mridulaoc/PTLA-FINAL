import { ICoupon } from "../../../domain layer/entities/Coupon";
import { CouponModel } from "../models/couponModel";
import { UserModel } from "../models/userModel";

export interface ICouponRepository {
  createCoupon(data: Partial<ICoupon>): Promise<ICoupon | null>;
  fetchCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; total: number }>;
  getCouponById(id: string): Promise<ICoupon | null>;
  updateCoupon(
    id: string,
    updateData: Partial<ICoupon>
  ): Promise<ICoupon | null>;
  deactivateCoupon(id: string, isActive: boolean): Promise<ICoupon | null>;
  validateCoupon(code: string, userId: string): Promise<ICoupon | null>;
  markCouponAsUsed(userId: string, couponCode: string): Promise<void>;
}

export class CouponRepository implements ICouponRepository {
  async createCoupon(data: Omit<ICoupon, "_id">): Promise<ICoupon | null> {
    try {
      const existingCoupon = await CouponModel.findOne({
        code: { $regex: `^${data.code}$`, $options: "i" },
      });
      if (existingCoupon) {
        throw new Error("A coupon with the same code already exists.");
      }
      const newCoupon = new CouponModel(data);
      return await newCoupon.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return null;
    }
  }

  async fetchCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const coupons = await CouponModel.find({}).skip(skip).limit(limit).sort({
        createdAt: -1,
      });
      const total = await CouponModel.countDocuments();
      return { coupons, total };
    } catch (error) {
      throw new Error(`Failed to find notifications: ${error}`);
    }
  }

  async getCouponById(id: string): Promise<ICoupon | null> {
    try {
      const coupon = await CouponModel.findById(id);
      return coupon;
    } catch (error) {
      throw new Error(`Failed to find coupon: ${error}`);
    }
  }

  async updateCoupon(
    id: string,
    updateData: Partial<ICoupon>
  ): Promise<ICoupon | null> {
    try {
      if (updateData.code) {
        const existingCoupon = await CouponModel.findOne({
          code: { $regex: `^${updateData.code}$`, $options: "i" },
          _id: { $ne: id },
        });

        if (existingCoupon) {
          throw new Error("A coupon with the same code already exists.");
        }
      }

      const updatedCoupon = await CouponModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      return updatedCoupon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return null;
    }
  }

  async deactivateCoupon(
    id: string,
    isActive: boolean
  ): Promise<ICoupon | null> {
    try {
      const coupon = await CouponModel.findByIdAndUpdate(
        id,
        { isActive: isActive },
        { new: true }
      );
      if (!coupon) {
        throw new Error("Failed to update coupon status");
      }
      return coupon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to update coupon status: ${error}`);
    }
  }

  async validateCoupon(code: string, userId: string): Promise<ICoupon | null> {
    const coupon = await CouponModel.findOne({
      code,
      isActive: true,
      expiryDate: { $gt: new Date() },
    });
    if (!coupon) {
      throw new Error("Invalid or expired coupon code");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const alreadyUsed = user.usedCoupons?.some(
      (usedCouponId) => usedCouponId.toString() === coupon._id.toString()
    );

    if (alreadyUsed) {
      throw new Error("You have already used this coupon");
    }
    return coupon;
  }

  async markCouponAsUsed(userId: string, couponCode: string) {
    const coupon = await CouponModel.findOne({ code: couponCode });
    if (coupon) {
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { usedCoupons: coupon._id },
      });
    }
  }
}
