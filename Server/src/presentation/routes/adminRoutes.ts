import express from "express";
import { AdminRepository } from "../../infrastructure layer/database/repositories/adminRepo";
import { AdminLoginUseCase } from "../../application/use-cases/admin/adminLoginUseCase";
import { FetchUsersUseCase } from "../../application/use-cases/admin/fetchAllUsersUseCase";
import { BcryptService } from "../../infrastructure layer/services/bcryptService";
import { JwtService } from "../../infrastructure layer/services/jwtService";
import { ToggleBlockUserUseCase } from "../../application/use-cases/admin/toggleBlockUserUseCase";
import { UserRepository } from "../../infrastructure layer/database/repositories/userRepo";
import { FetchCategoriesUseCase } from "../../application/use-cases/admin/fetchCategoriesUseCase";
import { CategoryRepository } from "../../infrastructure layer/database/repositories/categoriesRepo";
import { AddCategoryUseCase } from "../../application/use-cases/admin/addCategoryUseCase";
import { GetCategoryUseCase } from "../../application/use-cases/admin/getCategoryUseCase";
import { EditCategoryUseCase } from "../../application/use-cases/admin/editCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/admin/deleteCategoryUseCase";
import { AdminController } from "../controllers/adminController";
import { adminMiddleware } from "../../infrastructure layer/middleware/adminMiddleware";

const adminRouter = express.Router();

const adminRepo = new AdminRepository();
const userRepo = new UserRepository();
const categoryRepo = new CategoryRepository();
const bcryptService = new BcryptService();
const jwtService = new JwtService();

const adminLoginUseCase = new AdminLoginUseCase(
  adminRepo,
  bcryptService,
  jwtService
);
const fetchUserUseCase = new FetchUsersUseCase(adminRepo);
const toggleBlockUserUseCase = new ToggleBlockUserUseCase(userRepo);
const fetchCategoriesUseCase = new FetchCategoriesUseCase(categoryRepo);
const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
const getCategoryUseCase = new GetCategoryUseCase(categoryRepo);
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo);

const adminController = new AdminController(
  adminLoginUseCase,
  fetchUserUseCase,
  toggleBlockUserUseCase,
  fetchCategoriesUseCase,
  addCategoryUseCase,
  getCategoryUseCase,
  editCategoryUseCase,
  deleteCategoryUseCase
);

adminRouter.post("/", adminController.login);
adminRouter.get("/users", adminMiddleware, adminController.getAllUsers);
adminRouter.patch(
  "/users/:userId",
  adminMiddleware,
  adminController.toggleBlockUser
);

// Category Management Routes
adminRouter
  .route("/categories")
  .get(adminMiddleware, adminController.getAllCategories)
  .post(adminMiddleware, adminController.addCategory);

adminRouter
  .route("/categories/:id")
  .get(adminMiddleware, adminController.getCategory)
  .patch(adminMiddleware, adminController.editCategory)
  .delete(adminMiddleware, adminController.deleteCategory);

export default adminRouter;
