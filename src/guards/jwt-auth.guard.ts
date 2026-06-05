import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CONSTANTS } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies[CONSTANTS.JWT.COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Верифицируем токен
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      request.user = payload; // Добавляем данные юзера в запрос
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}