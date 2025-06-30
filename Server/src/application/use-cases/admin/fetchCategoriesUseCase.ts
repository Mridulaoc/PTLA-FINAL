import { ICategory } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../infrastructure/database/repositories/categoriesRepo";

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(): Promise<{ categories: ICategory[]; message?: string }> {
    try {
      const categories = await this.categoryRepository.fetchCategories();
      if (!categories) {
        throw new Error("No categories found");
      }
      return { categories };
    } catch (error) {
      return {
        categories: [],
        message: "No categories found",
      };
    }
  }
}
