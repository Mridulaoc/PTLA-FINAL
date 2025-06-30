import { Request, Response } from "express";
import { IUser } from "../../domain/entities/User";
import { notificationNamespace } from "../../app";
import { GetUserNotificationsUseCase } from "../../application/use-cases/userNotification/getUserNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/userNotification/markNotificationAsReaduseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../application/use-cases/userNotification/markAllNotificationsIseCase";
import { GetUnreadNotificationCountUseCase } from "../../application/use-cases/userNotification/getUnreadCountUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class UserNotificationController {
  constructor(
    private getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private markAllNotificationsUseCase: MarkAllNotificationsAsReadUseCase,
    private getUnreadCountUseCase: GetUnreadNotificationCountUseCase
  ) {}

  getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.getUserNotificationsUseCase.execute({
        userId,
        page,
        limit,
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.NOTIFICATION_FETCH_FAILED,
      });
    }
  };

  markNotificationAsRead = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user._id.toString();
      const notificationId = req.params.notificationId;

      const result = await this.markNotificationAsReadUseCase.execute({
        userId,
        notificationId,
      });

      if (result.success) {
        notificationNamespace
          .to(`user:${userId}`)
          .emit("notification:marked-read", notificationId);

        res.status(HttpStatus.OK).json({
          message: ResponseMessages.MARK_READ_SUCCESS,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.MARK_READ_FAILED,
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.MARK_READ_FAILED,
      });
    }
  };

  markAllNotificationsAsRead = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user._id.toString();

      const result = await this.markAllNotificationsUseCase.execute({ userId });

      if (result.success) {
        notificationNamespace
          .to(`user:${userId}`)
          .emit("notification:all-marked-read");

        res.status(HttpStatus.OK).json({
          success: true,
          message: ResponseMessages.MARK_ALL_READ_SUCCESS,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.MARK_ALL_READ_FAILED,
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.MARK_ALL_READ_FAILED,
      });
    }
  };

  getUnreadNotificationCount = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user._id.toString();

      const result = await this.getUnreadCountUseCase.execute({ userId });

      res.status(HttpStatus.OK).json({
        unreadCount: result.unreadCount,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.UNREAD_COUNT_FAILED,
      });
    }
  };
}
