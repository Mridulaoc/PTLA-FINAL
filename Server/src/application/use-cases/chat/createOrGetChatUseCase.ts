import { Namespace } from "socket.io";
import { ActiveUser } from "../../../domain layer/entities/ActiveUser";
import { IChat } from "../../../domain layer/entities/Chat";
import { IChatRepository } from "../../../infrastructure layer/database/repositories/chatRepo";
import { IChatSocketService } from "../../../infrastructure layer/services/socketServices/chatSocketService";

export class CreateOrGetChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private socketService: IChatSocketService,
    private chatNamespace: Namespace,
    private activeUsers?: Map<string, ActiveUser>
  ) {}
  async execute(studentId: string, adminId: string): Promise<IChat | null> {
    try {
      if (!studentId || !adminId) {
        throw new Error("Student and admin IDs are required");
      }
      const chat = await this.chatRepository.findChatByParticipants(
        studentId,
        adminId
      );
      if (chat && chat._id) {
        return await this.chatRepository.findChatById(chat._id.toString());
      }
      const doesStudentExist = await this.chatRepository.checkUserExists(
        studentId,
        "student"
      );
      const doesAdminExist = await this.chatRepository.checkUserExists(
        adminId,
        "admin"
      );
      if (!doesStudentExist || !doesAdminExist) {
        throw new Error("User not found");
      }
      const newChat = await this.chatRepository.createChat(studentId, adminId);

      if (!newChat) {
        throw new Error("Could not create new error");
      }
      if (!newChat._id) {
        throw new Error("New chat created but no ID was assigned");
      }
      const populatedChat = await this.chatRepository.findChatById(
        newChat._id.toString()
      );
      if (this.activeUsers && populatedChat) {
        this.socketService.emitChatCreation(
          this.chatNamespace,
          this.activeUsers,
          populatedChat,
          adminId
        );
      }
      return populatedChat;
    } catch (error) {
      console.error("Error in CreateOrGetChatUseCase:", error);
      throw error;
    }
  }
}
