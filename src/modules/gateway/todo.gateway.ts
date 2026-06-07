import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CONSTANTS } from '../../constants';

@WebSocketGateway(Number(CONSTANTS.NETWORK.WS_PORT), {
  cors: {
    origin: CONSTANTS.NETWORK.FRONTEND_URL,
    credentials: true,
  },
})
export class TodoGateway {
  @WebSocketServer()
  server!: Server;

  notifyTodoUpdated(type: 'created' | 'updated' | 'deleted', todo: Record<string, any>) {
    this.server.emit(CONSTANTS.WS_EVENTS.TODO_UPDATED, { type, todo });
  }

  notifyUserDeleted(userId: string) {
    this.server.emit(CONSTANTS.WS_EVENTS.USER_DELETED, { userId });
  }


  notifyFriendshipUpdated(type: 'added' | 'removed', followerId: string, user: { id: string, username: string }) {
    this.server.emit(CONSTANTS.WS_EVENTS.FRIENDSHIP_UPDATED, { type, followerId, user });
  }
}