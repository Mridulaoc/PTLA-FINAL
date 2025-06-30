import { Request, Response } from "express";
import { FetchCouponsUseCase } from "../../application/use-cases/coupon/fetchCouponUseCase";
import { GetCouponByIdUseCase } from "../../application/use-cases/coupon/getCouponByIdUseCase";
import { UpdateCouponUseCase } from "../../application/use-cases/coupon/updateCouponUseCase";
import { DeactivateCouponUseCase } from "../../application/use-cases/coupon/deactivateCouponUseCase";
import { ValidateCouponUseCase } from "../../application/use-cases/coupon/validateCouponUsecase";
import { CreateCouponUseCase } from "../../application/use-cases/coupon/createCouponUseCase";
import { IUser } from "../../domain/entities/User";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class CouponController {
  constructor(
    private createCouponUsecase: CreateCouponUseCase,
    private fetchCouponUsCase: FetchCouponsUseCase,
    private getCouponByIdUseCase: GetCouponByIdUseCase,
    private updateCouponUseCase: UpdateCouponUseCase,
    private deactivateCouponUseCase: DeactivateCouponUseCase,
    private validateCouponUseCase: ValidateCouponUseCase
  ) {}

  createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, discountType, discountValue, expiryDate } = req.body;
      const couponData = {
        code,
        discountType,
        discountValue,
        expiryDate,
      };
      const coupon = await this.createCouponUsecase.execute(couponData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ResponseMessages.COUPON_CREATED, coupon });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A coupon with the same code already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.COUPON_CREATION_ERROR });
    }
  };

  getCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { coupons, total } = await this.fetchCouponUsCase.execute(
        page,
        limit
      );
      res.status(HttpStatus.OK).json({ coupons, total, page, limit });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.COUPONS_FETCH_ALL_ERROR,
      });
    }
  };

  getCouponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const coupon = await this.getCouponByIdUseCase.execute(id);

      if (!coupon) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.COUPON_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(coupon);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.COUPON_FETCH_ONE_ERROR,
      });
    }
  };

  updateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const coupon = await this.updateCouponUseCase.execute(id, updateData);

      if (!coupon) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.COUPON_NOT_FOUND });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.COUPON_UPDATED, coupon });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A coupon with the same code already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.COUPON_CREATION_ERROR });
    }
  };

  deactivateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const result = await this.deactivateCouponUseCase.execute(id, isActive);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      let errorMessage = "Failed to update coupon status";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(HttpStatus.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
  };

  validateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.body;
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }
      const userId = user._id.toString();
      if (!code) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.MISSING_CODE,
        });
        return;
      }

      const coupon = await this.validateCouponUseCase.execute(code, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.APPLIED_SUCCESS,
        coupon,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "Invalid or expired coupon code" ||
          error.message === "You have already used this coupon"
        ) {
          res.status(HttpStatus.CONFLICT).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.COUPON_VALIDATION_ERROR });
    }
  };
}
