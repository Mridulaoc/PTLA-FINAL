import { ICategory } from "../../../domain layer/entities/Category";
import { ICategoryRepository } from "../../../infrastructure layer/database/repositories/categoriesRepo";

export class AddCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(
    categoryData: Omit<ICategory, "_id">
  ): Promise<ICategory | null> {
    try {
      const newcategory = await this.categoryRepository.create(categoryData);
      if (!newcategory) {
        throw new Error("A category with the same name already exists.");
      }
      return newcategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return null;
  }
}
