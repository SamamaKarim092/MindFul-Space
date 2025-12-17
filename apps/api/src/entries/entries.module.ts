import { Module } from '@nestjs/common';
import { EntriesResolver } from './entries.resolver';
import { EntriesService } from './entries.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EntriesResolver, EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
