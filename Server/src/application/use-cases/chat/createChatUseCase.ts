import { IChat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../infrastructure/database/repositories/chatRepo";

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(studentId: string, adminId: string): Promise<IChat | null> {
    try {
      const chat = await this.chatRepository.createChat(studentId, adminId);
      return chat;
    } catch (error) {
      throw new Error(
        `Failed to create chat between ${studentId} and ${adminId}`
      );
    }
  }
}
