import { Request, Response } from "express";
import { AdminLoginUseCase } from "../../application/use-cases/admin/adminLoginUseCase";
import { FetchUsersUseCase } from "../../application/use-cases/admin/fetchAllUsersUseCase";
import { ToggleBlockUserUseCase } from "../../application/use-cases/admin/toggleBlockUserUseCase";
import { FetchCategoriesUseCase } from "../../application/use-cases/admin/fetchCategoriesUseCase";
import { AddCategoryUseCase } from "../../application/use-cases/admin/addCategoryUseCase";
import { GetCategoryUseCase } from "../../application/use-cases/admin/getCategoryUseCase";
import { EditCategoryUseCase } from "../../application/use-cases/admin/editCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/admin/deleteCategoryUseCase";
import { GetDashboardUseCase } from "../../application/use-cases/admin/getDashboardUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class AdminController {
  constructor(
    private adminLoginUseCase: AdminLoginUseCase,
    private fetchUserUseCase: FetchUsersUseCase,
    private toggleBlockUserUseCase: ToggleBlockUserUseCase,
    private fetchCategoryUseCase: FetchCategoriesUseCase,
    private addCategoryUseCase: AddCategoryUseCase,
    private getCategoryUseCase: GetCategoryUseCase,
    private editCategoryUseCase: EditCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
    private getDashboardUseCase: GetDashboardUseCase
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { message, adminId, token } = await this.adminLoginUseCase.execute(
        email,
        password
      );

      res.status(HttpStatus.OK).json({ message, adminId, token });
    } catch (error) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: ResponseMessages.INVALID_CREDENTIALS });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { users, total } = await this.fetchUserUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({ users, total, page, limit });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          ResponseMessages.INTERNAL_SERVER_ERROR || "Error fetching users",
      });
    }
  };

  toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const updatedUser = await this.toggleBlockUserUseCase.execute(userId);
      if (updatedUser) {
        const id = updatedUser._id.toString();
        const isBlocked = updatedUser.isBlocked;
        res
          .status(HttpStatus.OK)
          .json({ message: ResponseMessages.USER_BLOCKED, id, isBlocked });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          ResponseMessages.INTERNAL_SERVER_ERROR || "Error blocking user",
      });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.fetchCategoryUseCase.execute();
      if (result.categories.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ message: result.message });
        return;
      }
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          ResponseMessages.INTERNAL_SERVER_ERROR || "Error fetching categories",
      });
    }
  };

  addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.REQUIRED_NAME_DESC });
        return;
      }
      const newCategory = await this.addCategoryUseCase.execute({
        name,
        description,
        isDeleted: false,
      });
      res.status(HttpStatus.CREATED).json({
        message: ResponseMessages.CATEGORY_CREATED,
        category: newCategory,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A category with the same name already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          ResponseMessages.INTERNAL_SERVER_ERROR || "Error creating category",
      });
    }
  };

  getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.getCategoryUseCase.execute(id);
      if (!category) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.CATEGORY_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(category);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          ResponseMessages.INTERNAL_SERVER_ERROR || "Error fetching category",
      });
    }
  };

  editCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const updatedCategory = await this.editCategoryUseCase.execute(
        id,
        name,
        description
      );
      res.status(HttpStatus.OK).json({
        message: ResponseMessages.CATEGORY_UPDATED,
        category: updatedCategory,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Category not found") {
          res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        } else if (
          error.message === "A category with the same name already exists."
        ) {
          res.status(HttpStatus.CONFLICT).json({ message: error.message });
        }
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
      }
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const { isDeleted } = req.body;
      const result = await this.deleteCategoryUseCase.execute(
        categoryId,
        !isDeleted
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  };

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.getDashboardUseCase.execute();

      res.status(HttpStatus.OK).json(stats);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  };
}
