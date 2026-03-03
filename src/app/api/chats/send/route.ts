// POST /api/chats/send — Send message (creates chat if no chatId provided)
// This handles the case where no chat exists yet

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { MessageRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { chatId: inputChatId, content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let chatId = inputChatId;

    // Create new chat if no chatId provided
    if (!chatId) {
      const chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        },
      });
      chatId = chat.id;
    } else {
      // Verify ownership
      const chat = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      if (chat.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Save user message
    await prisma.message.create({
      data: { chatId, role: MessageRole.USER, content },
    });

    // Get AI response
    const aiResponse = await getAIResponse(chatId, content);

    await prisma.message.create({
      data: { chatId, role: MessageRole.AI, content: aiResponse },
    });

    // Return full chat
    const updatedChat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/chats/send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAIResponse(chatId: string, userMessage: string): Promise<string> {
  const n8nWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 10 },
        contextEntry: true,
      },
    });

    const chatHistory = chat?.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    const contextEntry = chat?.contextEntry
      ? {
        title: chat.contextEntry.title,
        content: chat.contextEntry.content,
        moodLabels: chat.contextEntry.moodLabels,
      }
      : undefined;

    if (!n8nWebhookUrl) {
      console.warn('N8N_CHAT_WEBHOOK_URL not configured');
      return "I'm sorry, the AI service is not configured. Please try again later.";
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, chatHistory, contextEntry }),
    });

    if (!response.ok) throw new Error(`n8n webhook error: ${response.status}`);

    const data = await response.json();
    // n8n "All Entries" mode wraps response in an array
    const result = Array.isArray(data) ? data[0] : data;
    return result?.response || "I'm here to listen. Could you tell me more?";
  } catch (error) {
    console.error('Error calling n8n for AI response:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}
