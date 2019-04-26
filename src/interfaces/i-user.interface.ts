import { IChat } from './i-chat.interface';
import { IRoom } from './i-room.interface';
import { IPrivateRoom } from './i-private-room.interface';

export interface IUser {
    id?: string;
    nick?: string;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    biography?: string;
    interests?: string[];
    lat?: number;
    lng?: number;
    connected?: boolean;
    friend?: boolean;
    lastconnection?: string;
    me?: boolean;
    onesignalid?: string;
    contacts?: string[];
    chats?: IChat[];
    rooms?: IRoom[];
    privaterooms?: IPrivateRoom[];
    settings?: string;
}
