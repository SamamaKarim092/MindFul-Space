import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { MessageRole } from '@repo/prisma';

registerEnumType(MessageRole, {
  name: 'MessageRole',
  description: 'Role of the message sender',
});

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  chatId: string;

  @Field(() => MessageRole)
  role: MessageRole;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class Chat {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field(() => [Message])
  messages: Message[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
