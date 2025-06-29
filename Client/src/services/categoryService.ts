import { AxiosResponse } from "axios";
import {
  ICategoryResponse,
  ICategoryFormData,
  ICategory,
  ICategoryInput,
} from "../Types/categoryTypes";
import { adminApi, userApi } from "../utils/api";
import { CATEGORY_ROUTES } from "../constants/categoryRoutes";

export const categoryService = {
  fetchAll: (
    input: ICategoryInput
  ): Promise<AxiosResponse<ICategoryResponse>> => {
    const api = input.admin ? adminApi : userApi;
    console.log("Api:", api);
    return api.get(CATEGORY_ROUTES.BASE);
  },

  addCategory: (
    submissionData: ICategoryFormData
  ): Promise<AxiosResponse<{ message: string; category: ICategory }>> => {
    return adminApi.post(CATEGORY_ROUTES.BASE, submissionData);
  },

  fetchACategory: (categoryId: string): Promise<AxiosResponse<ICategory>> => {
    return adminApi.get(CATEGORY_ROUTES.BY_ID(categoryId));
  },

  updateCategory: (
    categoryId: string,
    name: string,
    description: string
  ): Promise<AxiosResponse<{ message: string; category: ICategory }>> => {
    return adminApi.patch(CATEGORY_ROUTES.BY_ID(categoryId), {
      name,
      description,
    });
  },

  deleteCategory: (
    categoryId: string,
    isDeleted: boolean
  ): Promise<AxiosResponse<{ category: ICategory; message: string }>> => {
    return adminApi.delete(CATEGORY_ROUTES.BY_ID(categoryId), {
      data: { isDeleted: isDeleted },
    });
  },
};
