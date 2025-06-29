import { ICoupon } from "../../../domain layer/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure layer/database/repositories/couponRepo";

export class FetchCouponsUseCase {
  constructor(private couponRepository: ICouponRepository) {}
  async execute(
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; total: number }> {
    try {
      const { coupons, total } = await this.couponRepository.fetchCoupons(
        page,
        limit
      );
      return { coupons, total };
    } catch (error) {
      throw new Error("Failed to fetch all coupons");
    }
  }
}
