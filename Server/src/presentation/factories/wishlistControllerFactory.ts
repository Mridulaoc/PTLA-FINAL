import { AddToWishlistUseCase } from "../../application/use-cases/wishlist/addToWishlistUsecase";
import { FetchWishlistUseCase } from "../../application/use-cases/wishlist/fetchWishlistUsecase";
import { RemoveFromWishlistUsecase } from "../../application/use-cases/wishlist/removeFromWishlistUseCase";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure layer/database/repositories/userRepo";
import { WishlistController } from "../controllers/wishlistController";

export const wishlistControllerFactory = (): WishlistController => {
  const userRepo: IUserRepository = new UserRepository();

  const addToWishlistUseCase = new AddToWishlistUseCase(userRepo);
  const removeFromWishlistUseCase = new RemoveFromWishlistUsecase(userRepo);
  const fetchWishlistUseCase = new FetchWishlistUseCase(userRepo);

  return new WishlistController(
    addToWishlistUseCase,
    removeFromWishlistUseCase,
    fetchWishlistUseCase
  );
};
