import { IMessage } from "../interfaces/i-message.interface";

export class Message implements IMessage {

    id?: string;
    creator?: any; // or string
    content?: string;
    image?: string;
    checked?: boolean;
    date?: string;  // or date
    mine?: boolean;

    constructor( messageJSON: any ) {
        this.id = messageJSON && messageJSON.id || null; 
        this.creator = messageJSON && messageJSON.creator || null;
        this.content = messageJSON && messageJSON.content || null;
        this.image = messageJSON && messageJSON.image || null;
        this.checked = messageJSON && messageJSON.checked || null;
        this.date = messageJSON && messageJSON.date || null;
        this.mine = messageJSON && messageJSON.mine || null;
    }

    static newMessage() {
        
    }
}