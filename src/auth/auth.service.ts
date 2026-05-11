import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, role: true, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    return { token: this.jwt.sign(payload) };
  }

  async register(dto: RegisterDto): Promise<UserEntity> {
    return this.userService.create(dto);
  }
}

