import axios, { AxiosResponse } from "axios";
import {
  ICourseResponse,
  IEnrollmentResponse,
  IUserSuggestionResponse,
} from "../Types/enrollmentTypes";
import { adminApi } from "../utils/api";
import { ENROLLMENT_ROUTES } from "../constants/enrollmentRoutes";

export const enrollmentService = {
  getUserSuggestions: async (
    query: string
  ): Promise<AxiosResponse<IUserSuggestionResponse>> => {
    try {
      const response = await adminApi.get(ENROLLMENT_ROUTES.ENROLLMENT_USERS, {
        params: { query },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching user suggestions."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getCourses: async (): Promise<AxiosResponse<ICourseResponse>> => {
    try {
      const response = await adminApi.get(ENROLLMENT_ROUTES.ENROLLMENT_COURSES);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching courses."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  enrollUserInCourse: async (
    userId: string,
    courseId: string,
    enrollmentType: string
  ): Promise<AxiosResponse<IEnrollmentResponse>> => {
    try {
      const response = await adminApi.post(ENROLLMENT_ROUTES.ENROLLMENT, {
        userId,
        courseId,
        enrollmentType,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching courses."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
};
