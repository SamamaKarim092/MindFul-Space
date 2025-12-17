import { Module } from '@nestjs/common';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatsResolver, ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
