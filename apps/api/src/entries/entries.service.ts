import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryInput, UpdateEntryInput, EntryFilterInput } from './dto/entry.dto';
import { Mood, Prisma } from '@repo/prisma';
import axios from 'axios';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  constructor(private prisma: PrismaService) {}

  async create(userId: string, input: CreateEntryInput) {
    const entry = await this.prisma.entry.create({
      data: {
        userId,
        title: input.title,
        content: input.content,
        mood: input.mood || Mood.NEUTRAL,
        tags: input.tags || [],
      },
    });

    // Trigger n8n workflow for sentiment analysis (non-blocking)
    this.triggerSentimentAnalysis(entry.id, entry.content);

    return entry;
  }

  /**
   * Triggers n8n workflow for sentiment analysis
   * This runs asynchronously and doesn't block the response
   */
  private async triggerSentimentAnalysis(entryId: string, content: string) {
    if (!this.n8nWebhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL not configured - skipping sentiment analysis');
      return;
    }

    try {
      await axios.post(this.n8nWebhookUrl, {
        entryId,
        content,
      });
      this.logger.log(`Triggered sentiment analysis for entry ${entryId}`);
    } catch (error) {
      this.logger.error(`Failed to trigger sentiment analysis: ${error.message}`);
      // Don't throw - we don't want to fail the entry creation if n8n is down
    }
  }

  async findAll(userId: string, filter?: EntryFilterInput) {
    const where: Prisma.EntryWhereInput = { userId };

    if (filter?.mood) {
      where.mood = filter.mood;
    }

    if (filter?.startDate || filter?.endDate) {
      where.createdAt = {};
      if (filter.startDate) {
        where.createdAt.gte = filter.startDate;
      }
      if (filter.endDate) {
        where.createdAt.lte = filter.endDate;
      }
    }

    return this.prisma.entry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: filter?.skip || 0,
      take: filter?.take || 20,
    });
  }

  async findOne(id: string, userId: string) {
    const entry = await this.prisma.entry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return entry;
  }

  async update(userId: string, input: UpdateEntryInput) {
    const entry = await this.findOne(input.id, userId);

    return this.prisma.entry.update({
      where: { id: entry.id },
      data: {
        title: input.title,
        content: input.content,
        mood: input.mood,
        tags: input.tags,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.entry.delete({
      where: { id },
    });
  }

  async updateSentiment(id: string, sentiment: number) {
    return this.prisma.entry.update({
      where: { id },
      data: { sentiment },
    });
  }

  async getStats(userId: string) {
    const entries = await this.prisma.entry.findMany({
      where: { userId },
      select: { mood: true, sentiment: true },
    });

    const stats = {
      totalEntries: entries.length,
      positiveCount: entries.filter((e) => e.mood === Mood.POSITIVE).length,
      neutralCount: entries.filter((e) => e.mood === Mood.NEUTRAL).length,
      negativeCount: entries.filter((e) => e.mood === Mood.NEGATIVE).length,
      averageSentiment: null as number | null,
    };

    const sentiments = entries.filter((e) => e.sentiment !== null).map((e) => e.sentiment!);
    if (sentiments.length > 0) {
      stats.averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    }

    return stats;
  }

  async getMoodTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.prisma.entry.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const trendMap = new Map<string, { positive: number; neutral: number; negative: number; sentiments: number[] }>();

    for (const entry of entries) {
      const dateKey = entry.createdAt.toISOString().split('T')[0];
      
      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, { positive: 0, neutral: 0, negative: 0, sentiments: [] });
      }

      const dayData = trendMap.get(dateKey)!;
      
      if (entry.mood === Mood.POSITIVE) dayData.positive++;
      else if (entry.mood === Mood.NEUTRAL) dayData.neutral++;
      else if (entry.mood === Mood.NEGATIVE) dayData.negative++;

      if (entry.sentiment !== null) {
        dayData.sentiments.push(entry.sentiment);
      }
    }

    return Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      positiveCount: data.positive,
      neutralCount: data.neutral,
      negativeCount: data.negative,
      averageSentiment: data.sentiments.length > 0
        ? data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length
        : null,
    }));
  }
}
