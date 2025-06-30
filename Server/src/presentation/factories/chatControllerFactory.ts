import { GetAdminChatsUseCase } from "../../application/use-cases/chat/getAdminChatUseCase";
import { GetChatUseCase } from "../../application/use-cases/chat/getChatByIdUseCase";
import { CreateChatUseCase } from "../../application/use-cases/chat/createChatUseCase";
import { CreateOrGetChatUseCase } from "../../application/use-cases/chat/createOrGetChatUseCase";
import { GetAdminIdUseCase } from "../../application/use-cases/chat/getAdminIdUseCase";
import { GetStudentsChatsUseCase } from "../../application/use-cases/chat/getStudentsChatsUseCase";
import { ChatController } from "../controllers/chatController";
import {
  ChatRepository,
  IChatRepository,
} from "../../infrastructure layer/database/repositories/chatRepo";
import {
  ChatSocketService,
  IChatSocketService,
} from "../../infrastructure layer/services/socketServices/chatSocketService";
import { Namespace } from "socket.io";
import { ActiveUser } from "../../domain layer/entities/ActiveUser";
import {
  AdminRepository,
  IAdminRepository,
} from "../../infrastructure layer/database/repositories/adminRepo";

export const chatControllerFactory = (
  chatNamespace: Namespace,
  activeUsers: Map<string, ActiveUser>
): ChatController => {
  const chatRepo: IChatRepository = new ChatRepository();
  const adminRepo: IAdminRepository = new AdminRepository();

  const chatSocketService: IChatSocketService = new ChatSocketService();

  const getAdminChatsUseCase = new GetAdminChatsUseCase(chatRepo);
  const getChatUseCase = new GetChatUseCase(chatRepo);
  const createChatUseCase = new CreateChatUseCase(chatRepo);
  const createOrGetChatUseCase = new CreateOrGetChatUseCase(
    chatRepo,
    chatSocketService,
    chatNamespace,
    activeUsers
  );
  const getAdminIdUseCase = new GetAdminIdUseCase(adminRepo);
  const getStudentChatsUseCase = new GetStudentsChatsUseCase(chatRepo);

  return new ChatController(
    getAdminChatsUseCase,
    getChatUseCase,
    createChatUseCase,
    createOrGetChatUseCase,
    getAdminIdUseCase,
    getStudentChatsUseCase
  );
};
