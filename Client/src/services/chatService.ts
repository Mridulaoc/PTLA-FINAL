import axios, { AxiosResponse } from "axios";
import {
  IChat,
  IGetAdminIdResponse,
  ISendMessageParams,
} from "../Types/chatTypes";
import { adminApi, userApi } from "../utils/api";
import { CHAT_ROUTES } from "../constants/chatRoutes";

export const chatService = {
  getAdminChats: async (): Promise<AxiosResponse<IChat[]>> => {
    try {
      const response = await adminApi.get(CHAT_ROUTES.GET_ADMIN_CHATS);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching admin chats."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getAdminId: async (): Promise<AxiosResponse<IGetAdminIdResponse>> => {
    try {
      const response = await userApi.get(CHAT_ROUTES.GET_ADMIN_ID);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching admin ID."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getStudentChats: async (): Promise<AxiosResponse<IChat[]>> => {
    try {
      const response = await userApi.get(CHAT_ROUTES.GET_STUDENT_CHATS);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching student chats."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getChatById: async (
    chatId: string,
    role: string
  ): Promise<AxiosResponse<IChat>> => {
    try {
      const api = role === "admin" ? adminApi : userApi;

      const response = await api.get(CHAT_ROUTES.GET_CHAT_BY_ID(chatId));
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching chat."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getOrCreateChat: async (adminId: string): Promise<AxiosResponse<IChat>> => {
    try {
      const response = await userApi.post(CHAT_ROUTES.GET_OR_CREATE_CHAT, {
        adminId,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while creating or getting chat."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  createAdminChat: async (studentId: string): Promise<AxiosResponse<IChat>> => {
    try {
      const response = await adminApi.post(CHAT_ROUTES.CREATE_ADMIN_CHAT, {
        studentId,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while creating admin chat."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  sendMessage: async (
    params: ISendMessageParams,
    role: string
  ): Promise<AxiosResponse<IChat>> => {
    try {
      if (
        !params.chatId ||
        params.chatId === "undefined" ||
        params.chatId === "null"
      ) {
        console.error("Cannot send message: Invalid chat ID", params.chatId);
        throw new Error("Chat ID is required");
      }

      if (!params.content) {
        console.error("Cannot send message: Content is empty");
        throw new Error("Message content is required");
      }

      const api = role === "admin" ? adminApi : userApi;

      const endPoint = CHAT_ROUTES.SEND_MESSAGE(params.chatId);

      const response = await api.post(endPoint, {
        content: params.content,
      });

      return response;
    } catch (error) {
      console.error("Error sending message:", error);

      if (axios.isAxiosError(error)) {
        console.error("API response:", error.response?.data);
        throw (
          error.response?.data?.message ||
          "An error occurred while sending message."
        );
      }

      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("An unknown error occurred");
    }
  },
};
