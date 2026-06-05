import { IUserPayload } from './user.interface';

declare module 'express' {
  interface Request {
    user?: IUserPayload;
  }
}