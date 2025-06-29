import axios, { AxiosResponse } from "axios";
import {
  ICreateNotificationResponse,
  IDeleteNotificationResponse,
  IFetchBundleResponse,
  IFetchCourseResponse,
  IFetchNotificationInput,
  IFetchNotificationResponse,
  IfetchTargetUsersInput,
  IFetchTargetUsersResponse,
  IFetchUserResponse,
  IMarkupAllNotificationsResponse,
  IMarkupNotificationInput,
  IMarkupNotificationResponse,
  INotificationFormData,
  IUnreadNotificationsResponse,
  IUserNotificationsInput,
  IUserNotificationsResponse,
} from "../Types/notificationTypes";
import { adminApi, userApi } from "../utils/api";
import { NOTIFICATION_ROUTES } from "../constants/notificationRoutes";

export const notificationService = {
  getAllNotifications: async (
    data: IFetchNotificationInput
  ): Promise<AxiosResponse<IFetchNotificationResponse>> => {
    try {
      const response = await adminApi.get(
        NOTIFICATION_ROUTES.ALL_NOTIFICATIONS,
        {
          params: data,
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching users."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchUsers: async (): Promise<AxiosResponse<IFetchUserResponse>> => {
    try {
      const response = await adminApi.get(NOTIFICATION_ROUTES.USERS);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching users."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  fetchCourses: async (): Promise<AxiosResponse<IFetchCourseResponse>> => {
    try {
      const response = await adminApi.get(NOTIFICATION_ROUTES.COURSES);
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

  fetchBundles: async (): Promise<AxiosResponse<IFetchBundleResponse>> => {
    try {
      const response = await adminApi.get(NOTIFICATION_ROUTES.BUNDLES);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching bundles."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchTargetUsers: async ({
    entityType,
    entityId,
  }: IfetchTargetUsersInput): Promise<
    AxiosResponse<IFetchTargetUsersResponse>
  > => {
    try {
      const response = await adminApi.get(
        NOTIFICATION_ROUTES.ENROLLED_USERS(entityType, entityId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching target users"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  createNotification: async (
    data: INotificationFormData
  ): Promise<AxiosResponse<ICreateNotificationResponse>> => {
    try {
      const response = await adminApi.post(NOTIFICATION_ROUTES.CREATE, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while creating notifications"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  deleteNotification: async (
    notificationId: string
  ): Promise<AxiosResponse<IDeleteNotificationResponse>> => {
    try {
      const response = await adminApi.delete(
        NOTIFICATION_ROUTES.DELETE(notificationId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while deleting notifications"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  fetchUserNotifications: async (
    data: IUserNotificationsInput
  ): Promise<AxiosResponse<IUserNotificationsResponse>> => {
    try {
      const response = await userApi.get(
        NOTIFICATION_ROUTES.USER_NOTIFICATIONS(data.userId),
        {
          params: data,
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching user notifications"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  markNotificationAsRead: async (
    data: IMarkupNotificationInput
  ): Promise<AxiosResponse<IMarkupNotificationResponse>> => {
    try {
      const response = await userApi.put(
        NOTIFICATION_ROUTES.MARK_AS_READ(data.notificationId),
        null,
        {
          params: { userId: data.userId },
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while marking notifications as read"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  markAllNotificationsAsRead: async (): Promise<
    AxiosResponse<IMarkupAllNotificationsResponse>
  > => {
    try {
      const response = await userApi.put(
        NOTIFICATION_ROUTES.MARK_ALL_AS_READ,
        null
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while marking all notifications as read"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
  getUnreadCount: async (): Promise<
    AxiosResponse<IUnreadNotificationsResponse>
  > => {
    try {
      const response = await userApi.get(NOTIFICATION_ROUTES.UNREAD_COUNT);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching unread notifications count"
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
};
