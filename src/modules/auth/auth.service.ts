import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {

    const username = dto.username.trim();
    const password = dto.password.trim();

    if (password !== dto.confirmPassword.trim()) {
      throw new ConflictException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      return await this.prisma.user.create({
        data: { username, password: hashedPassword },
      });
    } catch {
      throw new ConflictException('Username already exists');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username.trim() } });
    if (!user || !(await bcrypt.compare(dto.password.trim(), user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return { token };
  }

  async deleteUser(userId: string) {

    return await this.prisma.user.delete({ where: { id: userId } });
  }
}