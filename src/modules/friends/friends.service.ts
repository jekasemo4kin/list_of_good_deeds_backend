import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TodoGateway } from '../gateway/todo.gateway';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private gateway: TodoGateway,
  ) {}

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, username: true } } }
    });
    return friendships.map(f => f.following);
  }

  async toggleFriend(followerId: string, followingId: string) {
    if (followerId === followingId) throw new ConflictException('Cannot friend self');

    const existing = await this.prisma.friendship.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await this.prisma.friendship.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
      this.gateway.notifyFriendshipUpdated('removed', followerId, followingId);
      return { message: 'Friend removed' };
    } else {
      await this.prisma.friendship.create({
        data: { followerId, followingId },
      });
      this.gateway.notifyFriendshipUpdated('added', followerId, followingId);
      return { message: 'Friend added' };
    }
  }
}