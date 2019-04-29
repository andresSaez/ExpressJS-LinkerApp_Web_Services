import { IMessage } from "../interfaces/i-message.interface";
import ImageService from "../services/image.service";
import MessageModel from "../models/message.model";
import ChatModel from "../models/chat.model";

export class Message implements IMessage {

    id?: string;
    creator?: any; // or string
    content?: string;
    image?: string;
    checked?: boolean;
    date?: string;  // or date
    // mine?: boolean;

    constructor( messageJSON: any ) {
        this.id = messageJSON && messageJSON.id || null; 
        this.creator = messageJSON && messageJSON.creator || null;
        this.content = messageJSON && messageJSON.content || null;
        this.image = messageJSON && messageJSON.image || null;
        this.checked = messageJSON && messageJSON.checked || null;
        this.date = messageJSON && messageJSON.date || null;
        // this.mine = messageJSON && messageJSON.mine || null;
    }

    static async newMessage( message: any, idChat: any, idLogguedUser: any) {
        if (message.image !== '') {
            message.image = await ImageService.saveImage(`chat/${idChat}`, message.image);
        }
        message.date = new Date();
        message.creator = idLogguedUser;
        message.checked = false;

        let newMessage = new MessageModel({...message});
        let saveMessage = await newMessage.save();

        return ChatModel.findByIdAndUpdate( idChat, {$push: { messages: saveMessage.id }, $set: { lastmessage: saveMessage.id }}, { new: true } );
    }
}