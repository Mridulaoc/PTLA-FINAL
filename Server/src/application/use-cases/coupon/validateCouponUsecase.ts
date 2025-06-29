import { ICoupon } from "../../../domain layer/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure layer/database/repositories/couponRepo";

export class ValidateCouponUseCase {
  constructor(private couponReopsitory: ICouponRepository) {}

  async execute(code: string, userId: string): Promise<ICoupon | null> {
    return await this.couponReopsitory.validateCoupon(code, userId);
  }
}
