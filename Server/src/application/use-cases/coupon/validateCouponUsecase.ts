import { ICoupon } from "../../../domain/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";

export class ValidateCouponUseCase {
  constructor(private couponReopsitory: ICouponRepository) {}

  async execute(code: string, userId: string): Promise<ICoupon | null> {
    return await this.couponReopsitory.validateCoupon(code, userId);
  }
}
