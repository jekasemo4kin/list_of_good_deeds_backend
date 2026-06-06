import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { type Request } from 'express';

@ApiTags('friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @ApiOperation({ summary: 'Получить список друзей' })
  @ApiResponse({ status: 200, description: 'Список ID друзей' })
  @Get()
  async getFriends(@Req() req: Request) {
    return this.friendsService.getFriends(req.user!.sub);
  }

  @ApiOperation({ summary: 'Добавить/удалить из друзей (тогл)' })
  @ApiResponse({ status: 201, description: 'Статус дружбы изменен' })
  @Post(':userId')
  async toggleFriend(@Req() req: Request, @Param('userId') targetId: string) {
    return this.friendsService.toggleFriend(req.user!.sub, targetId);
  }
}