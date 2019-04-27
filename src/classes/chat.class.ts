import { IChat } from "../interfaces/i-chat.interface";
import ChatModel from "../models/chat.model";

export class Chat implements IChat {

    id?: string;
    messages: any[];

    constructor( chatJSON: any ) {
        this.id = chatJSON && chatJSON.id || null; 
        this.messages = chatJSON && chatJSON.messages || null;
    }

    static newChat() {
        let chat = {
            messages: []
        };

        let newChat = new ChatModel({...chat});
        return newChat.save();
    }
}