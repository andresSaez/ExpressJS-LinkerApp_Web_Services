import { IChat } from './i-chat.interface';

export interface IPrivateRoom {
    id?: string;
    chat: IChat; // or string?
}
