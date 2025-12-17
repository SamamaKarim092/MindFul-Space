import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async validateUser(token: string): Promise<AuthUser> {
    try {
      const supabaseUser = await this.supabaseService.verifyToken(token);

      if (!supabaseUser || !supabaseUser.id) {
        throw new UnauthorizedException('Invalid token');
      }

      // Find or create user in our database
      let user = await this.prisma.user.findUnique({
        where: { id: supabaseUser.id },
      });

      if (!user) {
        // Create user if doesn't exist (first login)
        user = await this.prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.full_name || null,
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
