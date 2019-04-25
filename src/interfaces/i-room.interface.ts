import { IUser } from './i-user.interface';
import { IChat } from './i-chat.interface';

export interface IRoom {
    id?: string;
    creator?: IUser; // or string
    name?: string;
    description?: string;
    image?: string;
    hastags?: string[];
    date?: string; // or date
    lat?: number;
    lng?: number;
    members?: IUser[]; // Or string[]
    chat?: IChat; // or string?
    mine?: boolean;
    distance?: number;
}
