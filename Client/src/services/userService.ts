import axios, { AxiosResponse } from "axios";
import {
  IChangePasswordInputs,
  IChangePasswordResponse,
  ICheckStatusResponse,
  IEnrolledCourse,
  IEnrollmentStatusResponse,
  IForgotPasswordResponse,
  IGoogleLoginResponse,
  ILoginData,
  IRegisterUserResponse,
  IRegistrationData,
  IResetPasswordData,
  IResetPasswordResponse,
  IUpdateUserInput,
  IUser,
  IUserLoginResponse,
  IUserProfileResponse,
  IVerifyOTPData,
  IVerifyOTPDataResponse,
} from "../Types/userTypes";
import { userApi } from "../utils/api";
import { USER_ROUTES } from "../constants/userRoutes";

export const userService = {
  register: (
    userData: IRegistrationData
  ): Promise<AxiosResponse<IRegisterUserResponse>> => {
    return userApi.post(USER_ROUTES.REGISTER, userData);
  },

  userLogin: (
    loginData: ILoginData
  ): Promise<AxiosResponse<IUserLoginResponse>> => {
    return userApi.post(USER_ROUTES.LOGIN, loginData);
  },

  userGoogleLogin: (
    googleToken: string
  ): Promise<AxiosResponse<IGoogleLoginResponse>> => {
    return userApi.post(USER_ROUTES.GOOGLE_LOGIN, { token: googleToken });
  },

  fetchUserProfile: (): Promise<AxiosResponse<IUserProfileResponse>> => {
    return userApi.get(USER_ROUTES.PROFILE);
  },

  updateProfile: (
    userData: IUpdateUserInput
  ): Promise<AxiosResponse<IUser>> => {
    return userApi.patch(USER_ROUTES.SETTINGS, userData);
  },

  updateProfileImg: (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    return userApi.patch(USER_ROUTES.UPLOAD_PROFILE_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  forgotPassword: (
    email: string
  ): Promise<AxiosResponse<IForgotPasswordResponse>> => {
    return userApi.post(USER_ROUTES.FORGOT_PASSWORD, { email });
  },

  verifyOTP: (
    data: IVerifyOTPData
  ): Promise<AxiosResponse<IVerifyOTPDataResponse>> => {
    return userApi.post(USER_ROUTES.VERIFY_OTP, data);
  },

  resetPassword: (
    data: IResetPasswordData
  ): Promise<AxiosResponse<IResetPasswordResponse>> => {
    return userApi.post(USER_ROUTES.RESET_PASSWORD, data);
  },

  checkStatus: async (): Promise<ICheckStatusResponse> => {
    const token = localStorage.getItem("jwtToken");
    const response = await userApi.get(USER_ROUTES.CHECK_STATUS, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    });
    return response.data;
  },

  fetchEnrolledCourses: async (): Promise<AxiosResponse<IEnrolledCourse[]>> => {
    try {
      const response = await userApi.get(USER_ROUTES.ENROLLED_COURSES);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching enrolled courses."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  getEnrollmentStatus: async (
    courseId: string
  ): Promise<AxiosResponse<IEnrollmentStatusResponse>> => {
    try {
      const response = await userApi.get(
        USER_ROUTES.ENROLLMENT_STATUS(courseId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching enrollment status."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  changePassword: async (
    data: IChangePasswordInputs
  ): Promise<AxiosResponse<IChangePasswordResponse>> => {
    try {
      const response = await userApi.post(USER_ROUTES.CHANGE_PASSWORD, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  },
};
