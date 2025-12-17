import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { Entry, EntryStats, MoodTrend } from './entities/entry.entity';
import { CreateEntryInput, UpdateEntryInput, EntryFilterInput } from './dto/entry.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Resolver(() => Entry)
@UseGuards(AuthGuard)
export class EntriesResolver {
  constructor(private readonly entriesService: EntriesService) {}

  @Mutation(() => Entry)
  async createEntry(
    @Args('input') input: CreateEntryInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Entry> {
    return this.entriesService.create(user.id, input);
  }

  @Query(() => [Entry], { name: 'entries' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Args('filter', { nullable: true }) filter?: EntryFilterInput,
  ): Promise<Entry[]> {
    return this.entriesService.findAll(user.id, filter);
  }

  @Query(() => Entry, { name: 'entry' })
  async findOne(
    @Args('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Entry> {
    return this.entriesService.findOne(id, user.id);
  }

  @Mutation(() => Entry)
  async updateEntry(
    @Args('input') input: UpdateEntryInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Entry> {
    return this.entriesService.update(user.id, input);
  }

  @Mutation(() => Entry)
  async deleteEntry(
    @Args('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Entry> {
    return this.entriesService.remove(id, user.id);
  }

  @Query(() => EntryStats, { name: 'entryStats' })
  async getStats(@CurrentUser() user: AuthUser): Promise<EntryStats> {
    return this.entriesService.getStats(user.id);
  }

  @Query(() => [MoodTrend], { name: 'moodTrends' })
  async getMoodTrends(
    @CurrentUser() user: AuthUser,
    @Args('days', { type: () => Int, defaultValue: 30 }) days: number,
  ): Promise<MoodTrend[]> {
    return this.entriesService.getMoodTrends(user.id, days);
  }
}
