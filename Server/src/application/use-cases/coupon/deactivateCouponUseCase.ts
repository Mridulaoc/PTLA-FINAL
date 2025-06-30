import { ICoupon } from "../../../domain/entities/Coupon";
import { ICouponRepository } from "../../../infrastructure/database/repositories/couponRepo";

export interface DeactivateCouponUseCaseInput {
  id: string;
  isActive: boolean;
}

export interface DeactivateCouponUseCaseOutput {
  message: string;
  coupon: ICoupon;
}

export class DeactivateCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(
    id: string,
    isActive: boolean
  ): Promise<DeactivateCouponUseCaseOutput> {
    try {
      const coupon = await this.couponRepository.deactivateCoupon(id, isActive);
      if (!coupon) {
        throw new Error("Coupon not found");
      }

      return {
        message: isActive ? "Coupon Activated" : "Coupon deactivated",
        coupon,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
}
