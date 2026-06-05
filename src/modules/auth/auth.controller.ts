import { Controller, Post, Body, Res, Delete, UseGuards, Req } from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from '../../constants';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(dto);
    res.cookie(CONSTANTS.JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged in' };
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: Request) {
    // В JwtAuthGuard мы записываем payload токена в req.user
    // sub — это id пользователя, который мы передали при подписи токена
    const userId = (req as any).user.sub;
    return this.authService.deleteUser(userId);
  }
}