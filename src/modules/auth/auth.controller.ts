import { Controller, Post, Body, Res, Delete, UseGuards, Req } from '@nestjs/common';
import { type Response, type Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from '../../constants';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Вход в систему' })
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

  @ApiOperation({ summary: 'Удаление профиля' })
  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: Request) {
    // В JwtAuthGuard мы записываем payload токена в req.user
    // sub — это id пользователя, который мы передали при подписи токена
    const userId = req.user!.sub;
    return this.authService.deleteUser(userId);
  }
}