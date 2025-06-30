import { ICoupon } from "../../../domain/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";

export class UpdateCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(
    id: string,
    updateData: Partial<ICoupon>
  ): Promise<ICoupon | null> {
    try {
      const updatedCoupon = await this.couponRepository.updateCoupon(
        id,
        updateData
      );
      if (!updatedCoupon) {
        throw new Error("A coupon with the same code already exists.");
      }
      return updatedCoupon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return null;
    }
  }
}
