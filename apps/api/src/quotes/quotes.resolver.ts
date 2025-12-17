import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuotesService } from './quotes.service';
import { Quote } from './entities/quote.entity';
import { Mood, QuoteType } from '@repo/prisma';

@Resolver(() => Quote)
export class QuotesResolver {
  constructor(private readonly quotesService: QuotesService) {}

  @Query(() => Quote, { name: 'randomQuote', nullable: true })
  async getRandomQuote(
    @Args('mood', { type: () => String, nullable: true }) mood?: Mood,
    @Args('type', { type: () => String, nullable: true }) type?: QuoteType,
  ): Promise<Quote | null> {
    return this.quotesService.getRandomQuote(mood, type);
  }

  @Query(() => [Quote], { name: 'quotes' })
  async findAll(
    @Args('mood', { type: () => String, nullable: true }) mood?: Mood,
    @Args('type', { type: () => String, nullable: true }) type?: QuoteType,
  ): Promise<Quote[]> {
    return this.quotesService.findAll(mood, type);
  }

  @Mutation(() => String, { description: 'Seed initial quotes (admin only)' })
  async seedQuotes(): Promise<string> {
    const result = await this.quotesService.seedQuotes();
    return result.message;
  }
}
