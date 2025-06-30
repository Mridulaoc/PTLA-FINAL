import { FetchClassUseCase } from "../../application/use-cases/class/fetchClassUseCase";
import { ScheduleClassUseCase } from "../../application/use-cases/class/scheduleClassUseCase";
import {
  ClassRepository,
  IClassRepository,
} from "../../infrastructure/database/repositories/classRepo";
import { ClassController } from "../controllers/classController";

export const classControllerFactory = (): ClassController => {
  const classrepo: IClassRepository = new ClassRepository();

  const scheduleClassUseCase = new ScheduleClassUseCase(classrepo);
  const fetchClassUseCase = new FetchClassUseCase(classrepo);

  return new ClassController(scheduleClassUseCase, fetchClassUseCase);
};
