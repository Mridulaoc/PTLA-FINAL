export const ADMIN_ROUTES = {
  LOGIN: "/",
  USERS: "/users",
  BLOCK_USER: (userId: string) => `/users/${userId}`,
};
