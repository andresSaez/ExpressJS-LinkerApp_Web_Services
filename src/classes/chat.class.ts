import { IChat } from "../interfaces/i-chat.interface";
import ChatModel from "../models/chat.model";
import { Message } from "./message.class";

export class Chat implements IChat {

    id?: string;
    messages: any[];
    lastmessage?: any;

    constructor( chatJSON: any ) {
        this.id = chatJSON && chatJSON.id || null; 
        this.messages = chatJSON && chatJSON.messages || null;
        this.lastmessage = chatJSON && chatJSON.lastmessage || null;
    }

    static newChat() {
        let chat = {
            messages: [],
        };

        let newChat = new ChatModel({...chat});
        return newChat.save();
    }

    static getChat( idChat: any ) {
        return new Promise( (resolve, reject) => {
            ChatModel.findById( idChat, (err, res) => {
                if (err) return reject(err);
                else {
                    let chat = new Chat(res);
                    chat.messages = chat.messages.map( messageJSON => new Message( messageJSON) );
                    chat.lastmessage = new Message(chat.lastmessage);
                    resolve(chat);
                }
            }).populate('lastmessage').populate({path: 'messages', model: 'message'});
        });
        
    }
}