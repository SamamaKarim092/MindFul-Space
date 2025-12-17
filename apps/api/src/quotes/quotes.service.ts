import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Mood, QuoteType } from '@repo/prisma';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async getRandomQuote(mood?: Mood, type?: QuoteType) {
    const where: { mood?: Mood; type?: QuoteType } = {};
    
    if (mood) where.mood = mood;
    if (type) where.type = type;

    // Get count of matching quotes
    const count = await this.prisma.quote.count({ where });

    if (count === 0) {
      return null;
    }

    // Get random quote
    const skip = Math.floor(Math.random() * count);
    const quotes = await this.prisma.quote.findMany({
      where,
      skip,
      take: 1,
    });

    return quotes[0] || null;
  }

  async findAll(mood?: Mood, type?: QuoteType) {
    const where: { mood?: Mood; type?: QuoteType } = {};
    
    if (mood) where.mood = mood;
    if (type) where.type = type;

    return this.prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { text: string; author?: string; type?: QuoteType; mood?: Mood }) {
    return this.prisma.quote.create({
      data: {
        text: data.text,
        author: data.author || 'Unknown',
        type: data.type || QuoteType.QUOTE,
        mood: data.mood || Mood.POSITIVE,
      },
    });
  }

  async seedQuotes() {
    const existingCount = await this.prisma.quote.count();
    
    if (existingCount > 0) {
      return { message: 'Quotes already seeded', count: existingCount };
    }

    const quotes = [
      { text: "The only way out is through.", author: "Robert Frost", type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "You are stronger than you think.", author: "Unknown", type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "It's okay to not be okay.", author: "Unknown", type: QuoteType.QUOTE, mood: Mood.NEUTRAL },
      { text: "Take a deep breath. You've got this.", author: "Unknown", type: QuoteType.TIP, mood: Mood.POSITIVE },
      { text: "Progress, not perfection.", author: "Unknown", type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "Try writing down three things you're grateful for today.", author: "Mental Health Tip", type: QuoteType.TIP, mood: Mood.POSITIVE },
      { text: "Remember to drink water and take breaks.", author: "Self-Care Reminder", type: QuoteType.TIP, mood: Mood.NEUTRAL },
      { text: "Your feelings are valid.", author: "Unknown", type: QuoteType.QUOTE, mood: Mood.NEUTRAL },
      { text: "Small steps still move you forward.", author: "Unknown", type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "Be gentle with yourself today.", author: "Unknown", type: QuoteType.TIP, mood: Mood.POSITIVE },
    ];

    await this.prisma.quote.createMany({ data: quotes });

    return { message: 'Quotes seeded successfully', count: quotes.length };
  }
}
