import { Namespace } from "socket.io";
import { NotificationController } from "../controllers/notificationController";
import {
  INotificationRepository,
  NotificationRepository,
} from "../../infrastructure/database/repositories/notificationRepo";
import {
  INotificationService,
  NotificationSocketService,
} from "../../infrastructure/services/socketServices/notificationSocketService";
import { CreateNotificationUseCase } from "../../application/use-cases/notification/createNotificationUseCase";
import { DeleteNotificationUseCase } from "../../application/use-cases/notification/deleteNotificationUseCase";
import { FetchALLNotificationUseCase } from "../../application/use-cases/notification/fetchAllNotificationsUseCase";
import { FetchNotificationCourseUsecase } from "../../application/use-cases/notification/fetchNotificationCourseUseCase";
import { FetchNotificationUsersUseCase } from "../../application/use-cases/notification/fetchNotificationUsersUseCase";
import { FetchBundleNotificationUseCase } from "../../application/use-cases/notification/fetchBundleNotificationUseCase";
import { FetchTargetUsersUseCase } from "../../application/use-cases/notification/fetchTargetUsersUseCase";

export const notificationControllerFactory = (
  notificationNamespace: Namespace,
  activeNotificationUsers: Map<string, string>,
  sharedNotificationService: INotificationService
): NotificationController => {
  const notificationRepo: INotificationRepository =
    new NotificationRepository();

  const createNotificationUseCase = new CreateNotificationUseCase(
    notificationRepo,
    sharedNotificationService
  );
  const deleteNotificationUseCase = new DeleteNotificationUseCase(
    notificationRepo
  );
  const fetchAllNotificationsUseCase = new FetchALLNotificationUseCase(
    notificationRepo
  );
  const fetchNotificationCoursesUseCase = new FetchNotificationCourseUsecase(
    notificationRepo
  );
  const fetchNotificationUsersUseCase = new FetchNotificationUsersUseCase(
    notificationRepo
  );
  const fetchBundleNotificationUseCase = new FetchBundleNotificationUseCase(
    notificationRepo
  );
  const fetchTargetUsersUseCase = new FetchTargetUsersUseCase(notificationRepo);

  return new NotificationController(
    createNotificationUseCase,
    deleteNotificationUseCase,
    fetchAllNotificationsUseCase,
    fetchNotificationUsersUseCase,
    fetchNotificationCoursesUseCase,
    fetchBundleNotificationUseCase,
    fetchTargetUsersUseCase
  );
};
