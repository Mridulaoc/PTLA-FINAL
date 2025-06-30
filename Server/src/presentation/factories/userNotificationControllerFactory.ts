import { GetUnreadNotificationCountUseCase } from "../../application/use-cases/userNotification/getUnreadCountUseCase";
import { GetUserNotificationsUseCase } from "../../application/use-cases/userNotification/getUserNotificationsUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../application/use-cases/userNotification/markAllNotificationsIseCase";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/userNotification/markNotificationAsReaduseCase";
import {
  INotificationRepository,
  NotificationRepository,
} from "../../infrastructure layer/database/repositories/notificationRepo";
import { UserNotificationController } from "../controllers/userNotificationController";

export const userNotificationControllerFactory =
  (): UserNotificationController => {
    const notificationRepo: INotificationRepository =
      new NotificationRepository();

    const getUserNotificationsUseCase = new GetUserNotificationsUseCase(
      notificationRepo
    );
    const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(
      notificationRepo
    );
    const markAllNotificationsUseCase = new MarkAllNotificationsAsReadUseCase(
      notificationRepo
    );
    const getUnreadNotificationCountUseCase =
      new GetUnreadNotificationCountUseCase(notificationRepo);

    return new UserNotificationController(
      getUserNotificationsUseCase,
      markNotificationAsReadUseCase,
      markAllNotificationsUseCase,
      getUnreadNotificationCountUseCase
    );
  };
