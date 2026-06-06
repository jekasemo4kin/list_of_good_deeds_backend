import { Controller, Post, Get, Body, Res, Delete, UseGuards, Req } from '@nestjs/common';
import { type Response, type Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from '../../constants';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя', schema: { example: { id: 'uuid', username: 'bobr' } } })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    return { 
      id: req.user!.sub, 
      username: req.user!.username 
    };
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
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

  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Кука успешно очищена' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(CONSTANTS.JWT.COOKIE_NAME);
    return { message: 'Logged out' };
  }

  @ApiOperation({ summary: 'Удаление профиля' })
  @ApiResponse({ status: 200, description: 'Профиль удален' })
  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: Request) {
    // В JwtAuthGuard мы записываем payload токена в req.user
    // sub — это id пользователя, который мы передали при подписи токена
    const userId = req.user!.sub;
    return this.authService.deleteUser(userId);
  }
}