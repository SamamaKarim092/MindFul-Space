// POST /api/chats/:id/messages — Send a message and get AI response

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { MessageRole } from '@prisma/client';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id: chatId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Verify chat ownership
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    // Save user message
    await prisma.message.create({
      data: { chatId, role: MessageRole.USER, content },
    });

    // Get AI response from n8n
    const aiResponse = await getAIResponse(chatId, content);

    // Save AI response
    await prisma.message.create({
      data: { chatId, role: MessageRole.AI, content: aiResponse },
    });

    // Return full chat with messages
    const updatedChat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/chats/[id]/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAIResponse(chatId: string, userMessage: string): Promise<string> {
  const n8nWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    console.error('N8N_CHAT_WEBHOOK_URL is not configured — cannot call AI');
    return "I'm sorry, the AI service is not configured. Please set N8N_CHAT_WEBHOOK_URL.";
  }

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

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, chatHistory, contextEntry }),
    });

    if (!response.ok) throw new Error(`n8n webhook error: ${response.status}`);

    const data = await response.json();
    return data.response || "I'm here to listen. Could you tell me more?";
  } catch (error) {
    console.error('Error calling n8n for AI response:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}
