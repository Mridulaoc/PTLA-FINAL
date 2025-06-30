import { IChat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../infrastructure/database/repositories/chatRepo";

export class GetChatUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(chatId: string): Promise<IChat | null> {
    try {
      if (!chatId) {
        throw new Error("Chat ID is required");
      }
      const chat = await this.chatRepository.findChatById(chatId);
      if (!chat) {
        throw new Error("Chat not found");
      }
      return chat;
    } catch (error) {
      throw error;
    }
  }
}
