import { Request, Response } from "express";
import { CreateNotificationUseCase } from "../../application/use-cases/notification/createNotificationUseCase";
import { DeleteNotificationUseCase } from "../../application/use-cases/notification/deleteNotificationUseCase";
import { FetchALLNotificationUseCase } from "../../application/use-cases/notification/fetchAllNotificationsUseCase";
import { FetchNotificationUsersUseCase } from "../../application/use-cases/notification/fetchNotificationUsersUseCase";
import { FetchNotificationCourseUsecase } from "../../application/use-cases/notification/fetchNotificationCourseUseCase";
import { FetchBundleNotificationUseCase } from "../../application/use-cases/notification/fetchBundleNotificationUseCase";
import { FetchTargetUsersUseCase } from "../../application/use-cases/notification/fetchTargetUsersUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class NotificationController {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase,
    private deleteNotificationUseCase: DeleteNotificationUseCase,
    private fetchAllNotificationsUseCase: FetchALLNotificationUseCase,
    private fetchNotificationUserUseCase: FetchNotificationUsersUseCase,
    private fetchNotificationCourseUseCase: FetchNotificationCourseUsecase,
    private fetchBundleNotificationUseCase: FetchBundleNotificationUseCase,
    private fetchTargetUsersUseCase: FetchTargetUsersUseCase
  ) {}

  createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const notificationData = req.body;
      console.log("Notification data from body", notificationData);

      if (
        !notificationData.title ||
        !notificationData.message ||
        !notificationData.targetType
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ResponseMessages.MISSING_FIELDS,
        });
        return;
      }
      if (
        notificationData.targetType === "specific" &&
        (!notificationData.targetUsers ||
          notificationData.targetUsers.length === 0)
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ResponseMessages.SPECIFIC_TARGET_REQUIRED,
        });
        return;
      }
      if (
        (notificationData.targetType === "course" ||
          notificationData.targetType === "bundle") &&
        !notificationData.targetEntity
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.TARGET_ENTITY_REQUIRED(
            notificationData.targetType
          ),
        });
        return;
      }
      const notification = await this.createNotificationUseCase.execute(
        notificationData
      );

      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.NOTIFICATION_CREATED, notification });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.NOTIFICATION_CREATE_ERROR,
      });
    }
  };

  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const notificationId = req.params.notificationId;

      const result = await this.deleteNotificationUseCase.execute(
        notificationId
      );
      res
        .status(HttpStatus.OK)
        .json({ message: result.message, notificationId });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.NOTIFICATION_DELETE_ERROR,
      });
    }
  };

  fetchAllNotifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { notifications, total } =
        await this.fetchAllNotificationsUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({ notifications, total, page, limit });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.NOTIFICATION_FETCH_ALL_ERROR,
      });
    }
  };

  fetchUsersForNotification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const users = await this.fetchNotificationUserUseCase.execute();
      res.status(HttpStatus.OK).json({ users });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.FETCH_USERS_ERROR,
      });
    }
  };

  fetchCourseForNotification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const courses = await this.fetchNotificationCourseUseCase.execute();
      res.status(HttpStatus.OK).json({ courses });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.FETCH_COURSES_FAILED,
      });
    }
  };

  fetchBundleForNotification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await this.fetchBundleNotificationUseCase.execute();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.FETCH_BUNDLES_ERROR,
      });
    }
  };

  fetchTargetUsersForNotification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { entityType, entityId } = req.params;
      const targetUsers = await this.fetchTargetUsersUseCase.execute(
        entityType,
        entityId
      );
      res.status(HttpStatus.OK).json(targetUsers);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.FETCH_TARGET_USERS_ERROR,
      });
    }
  };
}
