import { IMessage } from './i-message.interface';

export interface IChat {
    id?: string;
    messages: IMessage[];
    lastmessage?: any;
}
