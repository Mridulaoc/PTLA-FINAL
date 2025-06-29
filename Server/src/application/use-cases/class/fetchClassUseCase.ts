import { IClass } from "../../../domain layer/entities/Class";
import { IClassRepository } from "../../../infrastructure layer/database/repositories/classRepo";

export class FetchClassUseCase {
  constructor(private classRepository: IClassRepository) {}
  async execute(): Promise<IClass | null> {
    try {
      const classData = await this.classRepository.fetchClass();
      if (!classData) {
        throw new Error("Class not found");
      }
      return classData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch class");
    }
  }
}
