import { Class, IClass } from "../../../domain/entities/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/classRepo";

export class ScheduleClassUseCase {
  constructor(private classRepository: IClassRepository) {}
  async execute(classData: Partial<IClass>) {
    try {
      if (classData.duration! <= 0) {
        throw new Error("Duration must be greater than 0");
      }
      const classInstance = new Class(classData as IClass);
      if (classInstance.isRecurring && !classInstance.nextOccurrence) {
        classInstance.nextOccurrence = classInstance.calculateNextOccurrence();
      }

      const createdClass = await this.classRepository.create({
        ...classData,
        nextOccurrence: classInstance.nextOccurrence,
      });
      return createdClass;
    } catch (error) {
      throw new Error("Could not create class");
    }
  }
}
