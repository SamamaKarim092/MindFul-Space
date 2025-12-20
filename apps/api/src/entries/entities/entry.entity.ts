import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Mood } from '@repo/prisma';

// Register enum for GraphQL
registerEnumType(Mood, {
  name: 'Mood',
  description: 'Mood categories for journal entries',
});

@ObjectType()
export class Entry {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Mood, { nullable: true })
  mood: Mood | null;

  @Field(() => String, { nullable: true })
  customMoodLabel: string | null;

  @Field(() => [String])
  moodLabels: string[];

  @Field(() => Float, { nullable: true })
  sentiment: number | null;

  @Field(() => [String])
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class EntryStats {
  @Field()
  totalEntries: number;

  @Field()
  positiveCount: number;

  @Field()
  neutralCount: number;

  @Field()
  negativeCount: number;

  @Field(() => Float, { nullable: true })
  averageSentiment: number | null;
}

@ObjectType()
export class MoodTrend {
  @Field()
  date: string;

  @Field()
  positiveCount: number;

  @Field()
  neutralCount: number;

  @Field()
  negativeCount: number;

  @Field(() => Float, { nullable: true })
  averageSentiment: number | null;
}
