import { IUser } from './i-user.interface';

export interface IMessage {
    id?: string;
    creator?: IUser; // or string
    content?: string;
    image?: string;
    checked?: boolean;
    date?: string;  // or date
    mine?: boolean;
}
