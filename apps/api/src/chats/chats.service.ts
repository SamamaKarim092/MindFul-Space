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
  ) { }

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
    // Call n8n AI Chat workflow for AI response
    const n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678';

    try {
      // Get chat history for context
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: { orderBy: { createdAt: 'asc' }, take: 10 },
          contextEntry: true,
        },
      });

      // Format chat history for n8n
      const chatHistory = chat?.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })) || [];

      // Prepare context entry if exists
      const contextEntry = chat?.contextEntry ? {
        title: chat.contextEntry.title,
        content: chat.contextEntry.content,
        moodLabels: chat.contextEntry.moodLabels,
      } : undefined;

      const response = await fetch(`${n8nWebhookUrl}/webhook/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory,
          contextEntry,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "I'm here to listen. Could you tell me more?";
    } catch (error) {
      console.error('Error calling n8n for AI response:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
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

  async startContextualChat(userId: string, entryId: string) {
    // Fetch the journal entry for context
    const entry = await this.prisma.entry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Create a new chat linked to this entry
    const chat = await this.prisma.chat.create({
      data: {
        userId,
        contextEntryId: entryId,
        title: `Chat: ${entry.title.substring(0, 30)}${entry.title.length > 30 ? '...' : ''}`,
      },
    });

    // Generate contextual opening message
    const openingMessage = await this.getContextualOpening(entry);

    // Save the AI opening message
    await this.prisma.message.create({
      data: {
        chatId: chat.id,
        role: MessageRole.AI,
        content: openingMessage,
      },
    });

    // Return chat with messages
    const chatWithMessages = await this.prisma.chat.findUnique({
      where: { id: chat.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chatWithMessages) {
      throw new NotFoundException('Chat not found after creation');
    }

    return chatWithMessages;
  }

  private async getContextualOpening(entry: { title: string; content: string; moodLabels: string[] }): Promise<string> {
    // Call n8n AI Chat workflow for AI-generated contextual opening
    const n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678';

    try {
      const response = await fetch(`${n8nWebhookUrl}/webhook/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Start a supportive conversation about my journal entry. Acknowledge what I wrote and ask a thoughtful follow-up question.",
          chatHistory: [],
          contextEntry: {
            title: entry.title,
            content: entry.content,
            moodLabels: entry.moodLabels,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || this.getFallbackOpening(entry);
    } catch (error) {
      console.error('Error calling n8n for contextual opening:', error);
      return this.getFallbackOpening(entry);
    }
  }

  private getFallbackOpening(entry: { title: string; content: string; moodLabels: string[] }): string {
    const moodText = entry.moodLabels.length > 0
      ? `I noticed you're feeling ${entry.moodLabels.join(', ').toLowerCase()}.`
      : '';

    const contentPreview = entry.content.length > 100
      ? entry.content.substring(0, 100) + '...'
      : entry.content;

    return `I see you were writing about "${entry.title}". ${moodText}

${contentPreview ? `You mentioned: "${contentPreview}"` : ''}

I'm here to listen and help you explore these thoughts. What aspect of this would you like to talk about first?`;
  }
}

