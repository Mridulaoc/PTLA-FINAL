import { AddCategoryUseCase } from "../../application/use-cases/admin/addCategoryUseCase";
import { AdminLoginUseCase } from "../../application/use-cases/admin/adminLoginUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/admin/deleteCategoryUseCase";
import { EditCategoryUseCase } from "../../application/use-cases/admin/editCategoryUseCase";
import { FetchUsersUseCase } from "../../application/use-cases/admin/fetchAllUsersUseCase";
import { FetchCategoriesUseCase } from "../../application/use-cases/admin/fetchCategoriesUseCase";
import { GetCategoryUseCase } from "../../application/use-cases/admin/getCategoryUseCase";
import { GetDashboardUseCase } from "../../application/use-cases/admin/getDashboardUseCase";
import { ToggleBlockUserUseCase } from "../../application/use-cases/admin/toggleBlockUserUseCase";
import {
  AdminRepository,
  IAdminRepository,
} from "../../infrastructure/database/repositories/adminRepo";
import {
  CategoryRepository,
  ICategoryRepository,
} from "../../infrastructure/database/repositories/categoriesRepo";
import {
  DashboardRepository,
  IDashboardRepository,
} from "../../infrastructure/database/repositories/dashboardRepo";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure/database/repositories/userRepo";
import {
  BcryptService,
  IBcryptService,
} from "../../infrastructure/services/bcryptService";
import {
  IJwtService,
  JwtService,
} from "../../infrastructure/services/jwtService";
import { AdminController } from "../controllers/adminController";

export const adminControllerFactory = (): AdminController => {
  const adminRepo: IAdminRepository = new AdminRepository();
  const userRepo: IUserRepository = new UserRepository();
  const categoryRepo: ICategoryRepository = new CategoryRepository();
  const dashboardRepo: IDashboardRepository = new DashboardRepository();

  const jwtService: IJwtService = new JwtService();
  const bcryptService: IBcryptService = new BcryptService();

  const adminLoginUseCase = new AdminLoginUseCase(
    adminRepo,
    bcryptService,
    jwtService
  );
  const fetchUsersUseCase = new FetchUsersUseCase(adminRepo);
  const toggleBlockUser = new ToggleBlockUserUseCase(userRepo);
  const fetchCategoriesUseCase = new FetchCategoriesUseCase(categoryRepo);
  const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
  const getCategoryUseCase = new GetCategoryUseCase(categoryRepo);
  const editCategoryUseCase = new EditCategoryUseCase(categoryRepo);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo);
  const getDashboardUseCase = new GetDashboardUseCase(dashboardRepo);

  return new AdminController(
    adminLoginUseCase,
    fetchUsersUseCase,
    toggleBlockUser,
    fetchCategoriesUseCase,
    addCategoryUseCase,
    getCategoryUseCase,
    editCategoryUseCase,
    deleteCategoryUseCase,
    getDashboardUseCase
  );
};
