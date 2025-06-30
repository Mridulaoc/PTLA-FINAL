import { Request, Response } from "express";
import { IAdmin } from "../../domain layer/entities/Admin";
import { GetAdminChatsUseCase } from "../../application/use-cases/chat/getAdminChatUseCase";
import { GetChatUseCase } from "../../application/use-cases/chat/getChatByIdUseCase";
import { CreateChatUseCase } from "../../application/use-cases/chat/createChatUseCase";
import { CreateOrGetChatUseCase } from "../../application/use-cases/chat/createOrGetChatUseCase";
import { GetAdminIdUseCase } from "../../application/use-cases/chat/getAdminIdUseCase";
import { GetStudentsChatsUseCase } from "../../application/use-cases/chat/getStudentsChatsUseCase";
import { IUser } from "../../domain layer/entities/User";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

interface RequestWithAdmin extends Request {
  admin?: IAdmin;
}

export class ChatController {
  constructor(
    private getAdminChatsUseCase: GetAdminChatsUseCase,
    private getChatUseCase: GetChatUseCase,
    private createChatUseCase: CreateChatUseCase,
    private createOrGetChatUseCase: CreateOrGetChatUseCase,
    private getAdminIdUseCase: GetAdminIdUseCase,
    private getStudentChatsUseCase: GetStudentsChatsUseCase
  ) {}

  getAdminChats = async (
    req: RequestWithAdmin,
    res: Response
  ): Promise<void> => {
    try {
      const adminId = req.admin?._id.toString();
      if (!adminId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }
      const chats = await this.getAdminChatsUseCase.execute(adminId);
      res.status(HttpStatus.OK).json(chats);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatId } = req.params;

      const chat = await this.getChatUseCase.execute(chatId);
      if (!chat) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.CHAT_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(chat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  createChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.body;
      const admin = req.admin;
      if (!admin) {
        throw new Error("Admin id is required");
      }
      const adminId = admin._id;
      const chat = await this.createChatUseCase.execute(
        studentId,
        adminId.toString()
      );
      if (!chat) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.CHAT_NOT_FOUND });
        return;
      }
      res.status(HttpStatus.OK).json(chat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getOrCreateChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req.body;
      const user = req.user as IUser;
      const studentId = user._id.toString();

      const chat = await this.createOrGetChatUseCase.execute(
        studentId,
        adminId
      );
      if (!chat) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.CHAT_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(chat);
    } catch (error) {
      res.status(500).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getAdminId = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = await this.getAdminIdUseCase.execute();

      res.status(HttpStatus.OK).json({ adminId });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  getStudentChats = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      const studentId = user._id.toString();
      const chats = await this.getStudentChatsUseCase.execute(studentId);

      if (!chats) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.CHATS_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(chats);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };
}
