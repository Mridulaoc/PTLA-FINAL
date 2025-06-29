import { adminApi } from "../utils/api";
import {
  IAdminLoginCredentials,
  IAdminLoginResponse,
  IBlockUserResponse,
  IFetchUserInputs,
  IFetchUserResponse,
} from "../Types/adminTypes";
import { AxiosResponse } from "axios";
import { ADMIN_ROUTES } from "../constants/adminRoutes";

export const adminService = {
  loginAdmin: (
    loginData: IAdminLoginCredentials
  ): Promise<AxiosResponse<IAdminLoginResponse>> => {
    return adminApi.post(ADMIN_ROUTES.LOGIN, loginData);
  },

  fetchUsers: (
    data: IFetchUserInputs
  ): Promise<AxiosResponse<IFetchUserResponse>> => {
    return adminApi.get(ADMIN_ROUTES.USERS, { params: data });
  },

  blockUser: (userId: string): Promise<AxiosResponse<IBlockUserResponse>> => {
    return adminApi.patch(ADMIN_ROUTES.BLOCK_USER(userId));
  },
};
