import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'jwt-auth-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        role: true,
        email: true
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userContext = {
      email: user.email,
      role: user.role
    };
    return userContext;
  }
}
