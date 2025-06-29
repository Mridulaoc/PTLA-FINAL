import { IChat } from "../../../domain layer/entities/Chat";
import { IChatRepository } from "../../../infrastructure layer/database/repositories/chatRepo";

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
