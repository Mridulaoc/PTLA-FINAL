import { CreateCouponUseCase } from "../../application/use-cases/coupon/createCouponUseCase";
import { DeactivateCouponUseCase } from "../../application/use-cases/coupon/deactivateCouponUseCase";
import { FetchCouponsUseCase } from "../../application/use-cases/coupon/fetchCouponUseCase";
import { GetCouponByIdUseCase } from "../../application/use-cases/coupon/getCouponByIdUseCase";
import { UpdateCouponUseCase } from "../../application/use-cases/coupon/updateCouponUseCase";
import { ValidateCouponUseCase } from "../../application/use-cases/coupon/validateCouponUsecase";
import {
  CouponRepository,
  ICouponRepository,
} from "../../infrastructure/database/repositories/couponRepo";
import { CouponController } from "../controllers/couponControllers";

export const couponControllerFactory = (): CouponController => {
  const couponRepo: ICouponRepository = new CouponRepository();

  const createCouponUseCase = new CreateCouponUseCase(couponRepo);
  const fetchCouponUsCase = new FetchCouponsUseCase(couponRepo);
  const getCouponByIdUseCase = new GetCouponByIdUseCase(couponRepo);
  const updateCouponUseCase = new UpdateCouponUseCase(couponRepo);
  const deactivateCouponUseCase = new DeactivateCouponUseCase(couponRepo);
  const validateCouponUseCase = new ValidateCouponUseCase(couponRepo);

  return new CouponController(
    createCouponUseCase,
    fetchCouponUsCase,
    getCouponByIdUseCase,
    updateCouponUseCase,
    deactivateCouponUseCase,
    validateCouponUseCase
  );
};
