import axios, { AxiosResponse } from "axios";
import {
  IFetchAllReviewsInput,
  IFetchAllReviewsResponse,
  IFetchCourseReviewResponse,
  IFetchReviewParams,
  IReviewAddResponse,
  IReviewFormData,
} from "../Types/reviewTypes";
import { adminApi, userApi } from "../utils/api";
import { REVIEW_ROUTES } from "../constants/reviewRoutes";

export const reviewService = {
  addReview: async (
    courseId: string,
    reviewData: IReviewFormData
  ): Promise<AxiosResponse<IReviewAddResponse>> => {
    try {
      const response = await userApi.post(
        REVIEW_ROUTES.COURSE_REVIEWS(courseId),
        reviewData
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while adding review."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  fetchCourseReviews: async (
    courseId: string,
    data: IFetchReviewParams
  ): Promise<AxiosResponse<IFetchCourseReviewResponse>> => {
    try {
      const response = await userApi.get(
        REVIEW_ROUTES.COURSE_REVIEWS(courseId),
        {
          params: data,
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching reviews."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  updateReview: async (
    courseId: string,
    reviewId: string,
    reviewData: IReviewFormData
  ): Promise<AxiosResponse<IReviewAddResponse>> => {
    try {
      const response = await userApi.put(
        REVIEW_ROUTES.SINGLE_REVIEW(courseId, reviewId),
        reviewData
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while updating review."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  deleteReview: async (
    courseId: string,
    reviewId: string
  ): Promise<AxiosResponse<void>> => {
    try {
      const response = await userApi.delete(
        REVIEW_ROUTES.SINGLE_REVIEW(courseId, reviewId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while deleting review."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchAllReviews: async (
    params: IFetchAllReviewsInput
  ): Promise<AxiosResponse<IFetchAllReviewsResponse>> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.get(REVIEW_ROUTES.FETCH_ALL, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
