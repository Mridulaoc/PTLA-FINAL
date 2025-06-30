import { ICoupon } from "../../../domain/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";

export class CreateCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}
  async execute(data: Omit<ICoupon, "_id">): Promise<ICoupon | null> {
    try {
      const newCoupon = await this.couponRepository.createCoupon(data);
      if (!newCoupon) {
        throw new Error("A coupon with the same code already exists.");
      }
      return newCoupon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return null;
    }
  }
}
