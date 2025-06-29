import { AxiosResponse } from "axios";
import {
  IOtpInputs,
  IOtpResponse,
  IResendOtpInputs,
  IResendOtpResponse,
} from "../Types/otpTypes";
import { userApi } from "../utils/api";
import { OTP_ROUTES } from "../constants/otpRoutes";

export const otpService = {
  verifyOtp: async ({
    userId,
    otp,
  }: IOtpInputs): Promise<AxiosResponse<IOtpResponse>> => {
    return userApi.post(OTP_ROUTES.VERIFY_OTP, { userId, otp });
  },

  resendOtp: (
    userId: IResendOtpInputs
  ): Promise<AxiosResponse<IResendOtpResponse>> => {
    return userApi.post(OTP_ROUTES.RESEND_OTP, userId);
  },
};
