import axios, { AxiosResponse } from "axios";
import { userApi } from "../utils/api";
import {
  IAddToWishlistResponse,
  IFetchWishlistResponse,
  IRemoveFromWishlistResponse,
} from "../Types/wishListTypes";
import { WISHLIST_ROUTES } from "../constants/wishlistRoutes";

export const wishlistService = {
  addToWishlist: async (
    itemId: string,
    itemType: "Course" | "Bundle"
  ): Promise<AxiosResponse<IAddToWishlistResponse>> => {
    try {
      const response = await userApi.post(WISHLIST_ROUTES.WISHLIST, {
        itemId,
        itemType,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while adding to wishlist."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  removeFromWishlist: async (
    itemId: string
  ): Promise<AxiosResponse<IRemoveFromWishlistResponse>> => {
    try {
      const response = await userApi.delete(
        WISHLIST_ROUTES.REMOVE_WISHLIST_ITEM(itemId)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while deleting from the  wishlist."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },

  getWishlist: async (): Promise<AxiosResponse<IFetchWishlistResponse>> => {
    try {
      const response = await userApi.get(WISHLIST_ROUTES.WISHLIST);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.message ||
          "An error occurred while fetching the wishlist."
        );
      }
      throw new Error("An unknown error occurred");
    }
  },
};
