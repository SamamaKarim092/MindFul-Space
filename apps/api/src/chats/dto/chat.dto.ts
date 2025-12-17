import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  chatId?: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}

@InputType()
export class UpdateChatTitleInput {
  @Field()
  @IsString()
  chatId: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;
}
