import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { SendMessageInput, UpdateChatTitleInput } from './dto/chat.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Resolver(() => Chat)
@UseGuards(AuthGuard)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation(() => Chat)
  async sendMessage(
    @Args('input') input: SendMessageInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Chat> {
    return this.chatsService.sendMessage(user.id, input);
  }

  @Query(() => [Chat], { name: 'chats' })
  async findAll(@CurrentUser() user: AuthUser): Promise<Chat[]> {
    return this.chatsService.findAll(user.id);
  }

  @Query(() => Chat, { name: 'chat' })
  async findOne(
    @Args('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Chat> {
    return this.chatsService.findOne(id, user.id);
  }

  @Mutation(() => Chat)
  async updateChatTitle(
    @Args('input') input: UpdateChatTitleInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Chat> {
    return this.chatsService.updateTitle(user.id, input);
  }

  @Mutation(() => Chat)
  async deleteChat(
    @Args('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Chat> {
    return this.chatsService.remove(id, user.id);
  }
}
