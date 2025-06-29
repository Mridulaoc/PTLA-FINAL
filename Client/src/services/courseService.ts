import axios, { AxiosResponse } from "axios";
import { adminApi, userApi } from "../utils/api";
import {
  IAddCourseResponse,
  ICourse,
  ICourseDetailsInput,
  ICourseFormData,
  ICourseImageUploadResponse,
  ICourseUpdateData,
  IFetchCoursesInputs,
  IFetchCoursesResponse,
  IFetchPublicCourseInputs,
  IGenerateCertificateResponse,
  ILessonProgress,
  IUpdateLessonProgressInputs,
  IUpdateLessonProgressResponse,
} from "../Types/courseTypes";
import { COURSE_ROUTES } from "../constants/courseRoutes";

export const courseService = {
  uploadFeaturedImage: async (
    formData: FormData
  ): Promise<AxiosResponse<ICourseImageUploadResponse>> => {
    try {
      const response = await adminApi.post(
        COURSE_ROUTES.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while uploading the image."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  uploadIntroVideo: async (
    formData: FormData
  ): Promise<AxiosResponse<string>> => {
    try {
      const response = await adminApi.post(
        COURSE_ROUTES.UPLOAD_INTRO_VIDEO,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while uploading the video."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  addNewCourse: async (
    courseData: ICourseFormData
  ): Promise<AxiosResponse<IAddCourseResponse>> => {
    try {
      const response = await adminApi.post(COURSE_ROUTES.COURSES, courseData);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while adding the course."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchCourses: async (
    data: IFetchCoursesInputs
  ): Promise<AxiosResponse<IFetchCoursesResponse>> => {
    try {
      const response = await adminApi.get(COURSE_ROUTES.COURSES, {
        params: data,
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

  fetchPublicCourses: async (
    data: IFetchPublicCourseInputs
  ): Promise<AxiosResponse<IFetchCoursesResponse>> => {
    try {
      const response = await userApi.get(COURSE_ROUTES.COURSES, {
        params: data,
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

  fetchCourseDetails: async (
    input: ICourseDetailsInput
  ): Promise<AxiosResponse<ICourse>> => {
    try {
      const api = input.admin ? adminApi : userApi;
      const response = await api.get(COURSE_ROUTES.BY_ID(input.courseId));
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching course."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  updateCourse: async (
    courseData: ICourseUpdateData,
    courseId: string
  ): Promise<AxiosResponse<{ message: string; course: ICourse }>> => {
    try {
      const response = await adminApi.put(
        COURSE_ROUTES.BY_ID(courseId),
        courseData
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while updating course basic details."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  deleteCourse: async (
    courseId: string
  ): Promise<AxiosResponse<{ message: string }>> => {
    try {
      const response = await adminApi.delete(COURSE_ROUTES.BY_ID(courseId));
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while deleting the course."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  updateLessonProgress: async (
    data: IUpdateLessonProgressInputs
  ): Promise<AxiosResponse<IUpdateLessonProgressResponse>> => {
    try {
      const response = await userApi.patch(
        COURSE_ROUTES.UPDATE_LESSON(data.courseId, data.lessonId),
        {
          isCompleted: data.isCompleted,
          playbackPosition: data.playbackPosition,
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while updating lesson progress."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchLessonProgress: async (
    courseId: string
  ): Promise<AxiosResponse<ILessonProgress[]>> => {
    try {
      const response = await userApi.get(
        COURSE_ROUTES.LESSON_PROGRESS(courseId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching lesson progress."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  generateCertificate: async (
    courseId: string
  ): Promise<AxiosResponse<IGenerateCertificateResponse>> => {
    try {
      const response = await userApi.post(COURSE_ROUTES.CERTIFICATE(courseId));
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while generating the certificate."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchPopularCourses: async (
    limit: number
  ): Promise<AxiosResponse<ICourse[]>> => {
    try {
      const response = await userApi.get(COURSE_ROUTES.POPULAR_COURSES, {
        params: { limit },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while generating the certificate."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
};
