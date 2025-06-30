import { IChat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../infrastructure/database/repositories/chatRepo";

export class GetStudentsChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(studentId: string): Promise<IChat[] | null> {
    try {
      const chats = await this.chatRepository.getStudentChats(studentId);
      return chats;
    } catch (error) {
      throw new Error(`Failed to find chats for student ${studentId}`);
    }
  }
}
