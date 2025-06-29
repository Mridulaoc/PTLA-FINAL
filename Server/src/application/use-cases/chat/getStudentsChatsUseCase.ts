import { IChat } from "../../../domain layer/entities/Chat";
import { IChatRepository } from "../../../infrastructure layer/database/repositories/chatRepo";

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
