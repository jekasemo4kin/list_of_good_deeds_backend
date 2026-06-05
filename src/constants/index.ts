export const CONSTANTS = {
  JWT: {
    COOKIE_NAME: 'access_token',
    EXPIRATION: '1h',
  },
  
  WS_EVENTS: {
    TODO_UPDATED: 'todo_updated',
    USER_DELETED: 'user_deleted',
    FRIENDSHIP_UPDATED: 'friendship_updated',
  },
  
  NETWORK: {
    PORT: process.env.PORT || 3000,
    WS_PORT: process.env.WS_PORT || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  }
};