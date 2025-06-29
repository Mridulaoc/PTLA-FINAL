import { ICoupon } from "../../../domain layer/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure layer/database/repositories/couponRepo";

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
