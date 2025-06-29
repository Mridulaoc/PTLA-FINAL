import { ICategory } from "../../../domain layer/entities/Category";
import { ICategoryRepository } from "../../../infrastructure layer/database/repositories/categoriesRepo";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(
    categoryId: string,
    isDeleted: boolean
  ): Promise<{ message: string; category: ICategory }> {
    try {
      const category = await this.categoryRepository.findByIdAndDelete(
        categoryId,
        isDeleted
      );
      if (!category) {
        throw new Error("Category not found");
      }
      return {
        message: isDeleted ? "Category deleted" : "Category restored",
        category,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
}
