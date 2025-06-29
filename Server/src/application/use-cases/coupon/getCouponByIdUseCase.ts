import { ICoupon } from "../../../domain layer/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure layer/database/repositories/couponRepo";

export class GetCouponByIdUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(id: string): Promise<ICoupon | null> {
    try {
      return await this.couponRepository.getCouponById(id);
    } catch (error) {
      throw new Error("Failed to fetch coupon");
    }
  }
}
