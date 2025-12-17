import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MessageRole } from '@repo/prisma';
import { SendMessageInput, UpdateChatTitleInput } from './dto/chat.dto';

// Note: AI integration will be added later (Gemini or OpenAI via n8n)
// For now, we store messages and return a placeholder response

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async sendMessage(userId: string, input: SendMessageInput) {
    let chatId = input.chatId;

    // Create new chat if no chatId provided
    if (!chatId) {
      const chat = await this.prisma.chat.create({
        data: {
          userId,
          title: input.content.substring(0, 50) + (input.content.length > 50 ? '...' : ''),
        },
      });
      chatId = chat.id;
    } else {
      // Verify chat belongs to user
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      if (chat.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        chatId,
        role: MessageRole.USER,
        content: input.content,
      },
    });

    // TODO: Call AI service (Gemini/OpenAI) via n8n webhook or direct API
    // For now, return a placeholder response
    const aiResponse = await this.getAIResponse(chatId, input.content);

    // Save AI response
    const aiMessage = await this.prisma.message.create({
      data: {
        chatId,
        role: MessageRole.AI,
        content: aiResponse,
      },
    });

    // Return the chat with all messages
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found after creation');
    }

    return chat;
  }

  private async getAIResponse(chatId: string, userMessage: string): Promise<string> {
    // Placeholder AI response - will be replaced with actual AI integration
    // This will be handled by n8n workflow calling OpenAI/Gemini
    return `I received your message: "${userMessage.substring(0, 100)}..." I'm here to support your mental health journey. This is a placeholder response - AI integration will be configured via n8n.`;
  }

  async findAll(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Just get last message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return chat;
  }

  async updateTitle(userId: string, input: UpdateChatTitleInput) {
    const chat = await this.findOne(input.chatId, userId);

    return this.prisma.chat.update({
      where: { id: chat.id },
      data: { title: input.title },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async remove(chatId: string, userId: string) {
    await this.findOne(chatId, userId);

    return this.prisma.chat.delete({
      where: { id: chatId },
      include: { messages: true },
    });
  }
}
