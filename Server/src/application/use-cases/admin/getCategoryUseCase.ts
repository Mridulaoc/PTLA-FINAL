import { ICategory } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../infrastructure/database/repositories/categoriesRepo";

export class GetCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(id: string): Promise<ICategory | null> {
    try {
      const category = await this.categoryRepository.findById(id);

      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error) {
      return null;
    }
  }
}
