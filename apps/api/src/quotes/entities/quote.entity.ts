import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { QuoteType, Mood } from '@repo/prisma';

registerEnumType(QuoteType, {
  name: 'QuoteType',
  description: 'Type of motivational content',
});

@ObjectType()
export class Quote {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  author: string;

  @Field(() => QuoteType)
  type: QuoteType;

  @Field(() => Mood)
  mood: Mood;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
