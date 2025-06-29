import { Request, Response } from "express";
import { AddToCartUseCase } from "../../application/use-cases/cart/addToCartUseCase";
import { RemoveFromCartUseCase } from "../../application/use-cases/cart/removeFromCartUseCase";
import { FetchFromCartUseCase } from "../../application/use-cases/cart/fetchFromCartUseCase";
import { GetEnrolledCoursesUseCase } from "../../application/use-cases/cart/getEnrolledCoursesUseCase";
import { IUser } from "../../domain layer/entities/User";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class CartController {
  constructor(
    private addToCartUseCase: AddToCartUseCase,
    private removeFromCartUseCase: RemoveFromCartUseCase,
    private fetchFromCartUseCase: FetchFromCartUseCase,
    private getEnrolledCoursesUseCase: GetEnrolledCoursesUseCase
  ) {}

  addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
      }

      const userId = user._id.toString();
      const { id, itemType } = req.body;

      if (!id) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.COURSE_ID_REQUIRED });
        return;
      }

      const result = await this.addToCartUseCase.execute(userId, id, itemType);

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.ITEM_ADDED_SUCCESS,
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ITEM_ADD_FAILED });
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
      }

      const userId = user._id.toString();
      const { itemId } = req.params;
      const { itemType } = req.query;

      if (!itemId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.COURSE_ID_REQUIRED });
        return;
      }
      const result = await this.removeFromCartUseCase.execute(
        userId,
        itemId,
        itemType as "Course" | "Bundle"
      );

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.ITEM_REMOVED_SUCCESS,
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ITEM_REMOVE_FAILED });
    }
  };

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
      }

      const userId = user._id.toString();

      const result = await this.fetchFromCartUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_CART_FAILED });
    }
  };

  getEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
      }

      const userId = user._id.toString();

      const enrolledCourses = await this.getEnrolledCoursesUseCase.execute(
        userId
      );

      res.status(HttpStatus.OK).json(enrolledCourses);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: ResponseMessages.FETCH_ENROLLED_FAILED,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
