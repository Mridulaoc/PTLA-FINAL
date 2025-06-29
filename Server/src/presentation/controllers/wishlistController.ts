import { Request, Response } from "express";
import { AddToWishlistUseCase } from "../../application/use-cases/wishlist/addToWishlistUsecase";
import { RemoveFromWishlistUsecase } from "../../application/use-cases/wishlist/removeFromWishlistUseCase";
import { FetchWishlistUseCase } from "../../application/use-cases/wishlist/fetchWishlistUsecase";
import { IUser } from "../../domain layer/entities/User";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class WishlistController {
  constructor(
    private addToWishlistUseCase: AddToWishlistUseCase,
    private removeFromWishlistUseCase: RemoveFromWishlistUsecase,
    private fetchWishlistUseCase: FetchWishlistUseCase
  ) {}

  addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      const userId = user._id.toString();
      const { itemId, itemType } = req.body;

      const existingUser = await this.addToWishlistUseCase.execute(
        userId,
        itemId,
        itemType
      );

      if (!existingUser) {
        res.status(404).json({ message: ResponseMessages.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.WISHLIST_ITEM_ADDED,
        wishlist: existingUser.wishlist,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.ERROR_ADDING_WISHLIST,
      });
    }
  };

  removeFromWishList = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      const userId = user._id.toString();
      const { itemId } = req.params;
      if (!itemId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.ITEM_ID_REQUIRED });
        return;
      }
      const result = await this.removeFromWishlistUseCase.execute(
        userId,
        itemId
      );

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.WISHLIST_ITEM_REMOVED,
        wishlist: result?.wishlist,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ERROR_REMOVING_WISHLIST });
    }
  };

  getWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      const userId = user._id.toString();
      const existingUser = await this.fetchWishlistUseCase.execute(userId);

      if (!existingUser) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({ wishlist: existingUser.wishlist });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ERROR_FETCHING_WISHLIST });
    }
  };
}
