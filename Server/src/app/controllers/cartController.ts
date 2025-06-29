import { Request, Response } from "express";
import { AddToCartUseCase } from "../../application/use-cases/cart/addToCartUseCase";
import { RemoveFromCartUseCase } from "../../application/use-cases/cart/removeFromCartUseCase";
import { FetchFromCartUseCase } from "../../application/use-cases/cart/fetchFromCartUseCase";
import { GetEnrolledCoursesUseCase } from "../../application/use-cases/cart/getEnrolledCoursesUseCase";
import { IUser } from "../../domain layer/entities/User";

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
        res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user._id.toString();
      const { id, itemType } = req.body;

      if (!id) {
        res.status(400).json({ message: "Course ID is required" });
        return;
      }

      const result = await this.addToCartUseCase.execute(userId, id, itemType);

      res.status(200).json({
        message: `${itemType}added to cart successfully`,
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to add course to cart" });
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user._id.toString();
      const { itemId } = req.params;
      const { itemType } = req.query;

      if (!itemId) {
        res.status(400).json({ message: "Course ID is required" });
        return;
      }
      const result = await this.removeFromCartUseCase.execute(
        userId,
        itemId,
        itemType as "Course" | "Bundle"
      );

      res.status(200).json({
        message: `${itemType} removed from cart successfully`,
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to remove course from cart" });
    }
  };

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user._id.toString();

      const result = await this.fetchFromCartUseCase.execute(userId);

      res.status(200).json({
        cart: result?.cart,
        cartTotal: result?.cartTotal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  };

  getEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user._id.toString();

      const enrolledCourses = await this.getEnrolledCoursesUseCase.execute(
        userId
      );

      res.status(200).json(enrolledCourses);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch enrolled courses",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
