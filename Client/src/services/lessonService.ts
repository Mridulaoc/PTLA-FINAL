import axios, { AxiosResponse } from "axios";
import {
  IAddLessonResponse,
  IFetchLessonInputs,
  IFetchLessonsResponse,
  ILessonFormData,
  IUpdateLessonInputs,
  IUpdateLessonResponse,
} from "../Types/lessonTypes";
import { adminApi } from "../utils/api";
import { LESSON_ROUTES } from "../constants/lessonRoutes";

export const lessonService = {
  addNewLesson: async ({
    courseId,
    lessons,
  }: {
    courseId: string;
    lessons: ILessonFormData[];
  }): Promise<AxiosResponse<IAddLessonResponse>> => {
    try {
      const response = await adminApi.post(
        LESSON_ROUTES.LESSONS_BY_COURSE(courseId),
        {
          lessons,
        }
      );
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

  fetchLessons: async ({
    courseId,
    data,
  }: {
    courseId: string;
    data: IFetchLessonInputs;
  }): Promise<AxiosResponse<IFetchLessonsResponse>> => {
    try {
      const response = await adminApi.get(
        LESSON_ROUTES.LESSONS_BY_COURSE(courseId),
        {
          params: data,
        }
      );
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

  updateLesson: async ({
    lessonId,
    lessonData,
  }: IUpdateLessonInputs): Promise<AxiosResponse<IUpdateLessonResponse>> => {
    try {
      const response = await adminApi.put(
        LESSON_ROUTES.SINGLE_LESSON(lessonId),
        lessonData
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while updating lesson.";
        throw new Error(errorMessage);
      }
      throw new Error("An unknown error occurred");
    }
  },
  deleteLesson: async (
    lessonId: string
  ): Promise<AxiosResponse<{ message: string }>> => {
    try {
      const response = await adminApi.delete(
        LESSON_ROUTES.SINGLE_LESSON(lessonId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while deleting the lesson."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
};
