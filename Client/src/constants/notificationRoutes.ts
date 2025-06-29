export const NOTIFICATION_ROUTES = {
  ALL_NOTIFICATIONS: "/all-notifications",
  USERS: "/notifications/users",
  COURSES: "/notifications/courses",
  BUNDLES: "/notifications/bundles",
  CREATE: "/notification",
  DELETE: (notificationId: string) => `/notifications/${notificationId}`,
  ENROLLED_USERS: (entityType: string, entityId: string) =>
    `/${entityType}/${entityId}/enrolledUsers`,
  USER_NOTIFICATIONS: (userId: string) => `/${userId}/notifications`,
  MARK_AS_READ: (notificationId: string) =>
    `/notifications/${notificationId}/read`,
  MARK_ALL_AS_READ: "/notifications/read",
  UNREAD_COUNT: "/notifications/unread",
};
