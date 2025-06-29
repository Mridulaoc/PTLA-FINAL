import { AxiosResponse } from "axios";
import {
  ICoupon,
  ICouponDeactivateInput,
  ICouponDeactivateResponse,
  ICreateCouponInput,
  ICreateCouponResponse,
  IFetchCouponInputs,
  IFetchCouponResponse,
  IUpdateCouponResponse,
} from "../Types/couponTypes";
import { adminApi } from "../utils/api";
import { COUPON_ROUTES } from "../constants/couponRoutes";

export const couponService = {
  createCoupon: async (
    data: ICreateCouponInput
  ): Promise<AxiosResponse<ICreateCouponResponse>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.post(COUPON_ROUTES.BASE, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  fetchCoupons: async (
    data: IFetchCouponInputs
  ): Promise<AxiosResponse<IFetchCouponResponse>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.get(COUPON_ROUTES.BASE, { params: data });
      return response;
    } catch (error) {
      throw error;
    }
  },

  fetchCouponById: async (
    couponId: string
  ): Promise<AxiosResponse<ICoupon>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.get(COUPON_ROUTES.BY_ID(couponId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCoupon: async (
    couponId: string,
    data: ICreateCouponInput
  ): Promise<AxiosResponse<IUpdateCouponResponse>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.put(COUPON_ROUTES.BY_ID(couponId), data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCoupon: async (
    data: ICouponDeactivateInput
  ): Promise<AxiosResponse<ICouponDeactivateResponse>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.patch(COUPON_ROUTES.BY_ID(data.id), {
        isActive: data.isActive,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
