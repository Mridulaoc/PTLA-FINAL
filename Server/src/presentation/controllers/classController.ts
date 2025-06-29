import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ScheduleClassUseCase } from "../../application/use-cases/class/scheduleClassUseCase";
import { FetchClassUseCase } from "../../application/use-cases/class/fetchClassUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class ClassController {
  constructor(
    private scheduleClassUseCase: ScheduleClassUseCase,
    private fetchClassUseCase: FetchClassUseCase
  ) {}

  scheduleClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, dayOfWeek, startTime, duration } = req.body;

      if (!title || !description || !dayOfWeek || !startTime || !duration) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ResponseMessages.MISSING_FIELDS,
        });
      }
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      if (!daysOfWeek.includes(dayOfWeek)) {
        throw new Error("Invalide day of the week");
      }
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(startTime)) {
        throw new Error("Invalid time format");
      }
      if (isNaN(duration) || duration <= 0) {
        throw new Error("Duration must be greater than 0");
      }
      const roomId = uuidv4();
      const result = await this.scheduleClassUseCase.execute({
        title,
        description,
        dayOfWeek,
        startTime,
        duration: Number(duration),
        isRecurring: true,
        roomId,
      });

      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.CLASS_SCHEDULED });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const classData = await this.fetchClassUseCase.execute();
      if (!classData) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.CLASS_NOT_FOUND });
        return;
      }
      res.status(HttpStatus.OK).json(classData);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };
}
