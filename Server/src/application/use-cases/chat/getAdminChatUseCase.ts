import { IChat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../infrastructure/database/repositories/chatRepo";

export class GetAdminChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(adminId: string): Promise<IChat[] | null> {
    try {
      return await this.chatRepository.getAdminChats(adminId);
    } catch (error) {
      throw new Error(`Failed to find chats for admin ${adminId}`);
    }
  }
}
