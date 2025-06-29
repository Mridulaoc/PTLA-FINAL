export const CHAT_ROUTES = {
  GET_ADMIN_CHATS: "/chats",
  GET_STUDENT_CHATS: "/chats",
  GET_ADMIN_ID: "/get-adminId",
  GET_CHAT_BY_ID: (chatId: string) => `/chats/${chatId}`,
  GET_OR_CREATE_CHAT: "/create/chats",
  CREATE_ADMIN_CHAT: "/chats/create",
  SEND_MESSAGE: (chatId: string) => `/chats/${chatId}/messages`,
};
