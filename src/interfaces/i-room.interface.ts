import { IUser } from './i-user.interface';
import { IChat } from './i-chat.interface';

export interface IRoom {
    id?: string;
    creator?: string; // or string
    name?: string;
    description?: string;
    image?: string;
    hastags?: string[];
    date?: Date; // or date
    lat?: number;
    lng?: number;
    lastmessage?: any;
    members?: string[]; // Or string[]
    chat?: string; // or string?
    mine?: boolean;
    distance?: number;
}
