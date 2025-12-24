import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryInput, UpdateEntryInput, EntryFilterInput } from './dto/entry.dto';
import { Mood, Prisma } from '@repo/prisma';
import axios from 'axios';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  private get n8nWebhookUrl() {
    return this.configService.get<string>('N8N_WEBHOOK_URL');
  }

  private get n8nMoodSuggestionUrl() {
    return this.configService.get<string>('N8N_MOOD_SUGGESTION_URL');
  }

  async create(userId: string, input: CreateEntryInput) {
    const entry = await this.prisma.entry.create({
      data: {
        userId,
        title: input.title,
        content: input.content,
        mood: input.mood || null,
        customMoodLabel: input.customMoodLabel || null,
        moodLabels: input.moodLabels || [],
        tags: input.tags || [],
      },
    });

    // Trigger n8n workflow for sentiment analysis (non-blocking)
    this.triggerSentimentAnalysis(entry.id, entry.content, entry.title);

    return entry;
  }

  /**
 * Triggers n8n workflow for sentiment analysis
 * This runs asynchronously and doesn't block the response
 */
  private async triggerSentimentAnalysis(entryId: string, content: string, title?: string) {
    const webhookUrl = this.n8nWebhookUrl;
    if (!webhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL not configured - skipping sentiment analysis');
      return;
    }

    try {
      this.logger.log(`Triggering sentiment analysis for entry ${entryId} via ${webhookUrl}`);
      await axios.post(webhookUrl, {
        entryId,
        title,
        content,
      });
      this.logger.log(`Successfully triggered sentiment analysis for entry ${entryId}`);
    } catch (error) {
      this.logger.error(`Failed to trigger sentiment analysis for entry ${entryId}: ${error.message}`);
      if (error.response) {
        this.logger.error(`n8n response error: ${JSON.stringify(error.response.data)}`);
      }
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
    try {
      const entry = await this.prisma.entry.update({
        where: { id },
        data: { sentiment },
      });
      this.logger.log(`Updated sentiment for entry ${id} to ${sentiment}`);
      return entry;
    } catch (error) {
      this.logger.error(`Failed to update sentiment for entry ${id}: ${error.message}`);
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
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

  /**
   * Get AI-powered mood suggestions for given text
   * Calls n8n workflow synchronously and returns suggestions
   */
  async suggestMood(content: string, title?: string): Promise<Array<{ label: string; color_category: string }>> {
    const webhookUrl = this.n8nMoodSuggestionUrl;
    if (!webhookUrl) {
      this.logger.warn('N8N_MOOD_SUGGESTION_URL not configured - returning empty suggestions');
      return [];
    }

    try {
      const payload = { 
        text: content,
        title: title || '',
        content: content
      };
      this.logger.log('Requesting AI mood suggestions from n8n');
      this.logger.log('📤 Payload being sent to n8n:', JSON.stringify(payload, null, 2));
      const response = await axios.post(
        webhookUrl,
        payload,
        { timeout: 10000 } // 10 second timeout
      );

      const raw = response.data?.suggestions || [];

      // Normalize and validate the response
      const suggestions = Array.isArray(raw)
        ? raw
          .map((item) => {
            // If it's already an object with label and color_category, use it
            if (item && typeof item.label === 'string' && typeof item.color_category === 'string') {
              return { label: item.label, color_category: item.color_category };
            }
            // If it's a string, default to PURPLE for unknown moods
            if (typeof item === 'string') {
              return { label: item, color_category: 'PURPLE' };
            }
            return null;
          })
          .filter((v): v is { label: string; color_category: string } => Boolean(v))
        : [];

      this.logger.log(`Received ${suggestions.length} mood suggestions`);
      return suggestions;
    } catch (error) {
      this.logger.error('Error getting mood suggestions from n8n:', error.message);
      return [];
    }
  }
}

