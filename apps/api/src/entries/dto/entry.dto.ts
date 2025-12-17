import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsArray, MaxLength, MinLength } from 'class-validator';
import { Mood } from '@repo/prisma';

@InputType()
export class CreateEntryInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @Field()
  @IsString()
  @MinLength(1)
  content: string;

  @Field(() => String, { defaultValue: 'NEUTRAL' })
  @IsEnum(Mood)
  @IsOptional()
  mood?: Mood;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

@InputType()
export class UpdateEntryInput extends PartialType(CreateEntryInput) {
  @Field()
  @IsString()
  id: string;
}

@InputType()
export class EntryFilterInput {
  @Field(() => String, { nullable: true })
  @IsEnum(Mood)
  @IsOptional()
  mood?: Mood;

  @Field({ nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  skip?: number;

  @Field({ nullable: true, defaultValue: 20 })
  @IsOptional()
  take?: number;
}
