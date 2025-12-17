import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [AuthService, AuthGuard, SupabaseService],
  exports: [AuthService, AuthGuard, SupabaseService],
})
export class AuthModule {}
