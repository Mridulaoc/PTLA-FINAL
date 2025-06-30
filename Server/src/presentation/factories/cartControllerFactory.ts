import { CartController } from "../controllers/cartController";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure layer/database/repositories/userRepo";

import { AddToCartUseCase } from "../../application/use-cases/cart/addToCartUseCase";
import { RemoveFromCartUseCase } from "../../application/use-cases/cart/removeFromCartUseCase";
import { FetchFromCartUseCase } from "../../application/use-cases/cart/fetchFromCartUseCase";
import { GetEnrolledCoursesUseCase } from "../../application/use-cases/cart/getEnrolledCoursesUseCase";

export const cartControllerFactory = (): CartController => {
  const userRepo: IUserRepository = new UserRepository();

  const addToCartUseCase = new AddToCartUseCase(userRepo);
  const removeFromCartUseCase = new RemoveFromCartUseCase(userRepo);
  const fetchFromCartUseCase = new FetchFromCartUseCase(userRepo);
  const getEnrolledCoursesUseCase = new GetEnrolledCoursesUseCase(userRepo);

  return new CartController(
    addToCartUseCase,
    removeFromCartUseCase,
    fetchFromCartUseCase,
    getEnrolledCoursesUseCase
  );
};
