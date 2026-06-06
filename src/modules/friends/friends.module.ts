import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { PrismaService } from '../../prisma.service';
import { TodoGateway } from '../gateway/todo.gateway';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService, TodoGateway],
})
export class FriendsModule {}