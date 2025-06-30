import { ICoupon } from "../../../domain/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";

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
