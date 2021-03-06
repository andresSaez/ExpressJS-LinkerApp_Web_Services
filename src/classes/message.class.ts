import { IMessage } from "../interfaces/i-message.interface";
import ImageService from "../services/image.service";
import MessageModel from "../models/message.model";
import ChatModel from "../models/chat.model";
import { User } from "./user.class";
import { PushService } from "../services/push.service";
import { PrivateRoom } from "./privateroom.class";

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
        // this.mine = messageJSON && messageJSON.mine || null;
    }

    static async newMessage( message: any, idChat: any, idLogguedUser: any) {
        if (message.image !== '') {
            message.image = await ImageService.saveImage(`messages`, message.image);
        }
        message.date = new Date();
        message.creator = idLogguedUser;
        message.checked = false;

        let newMessage = new MessageModel({...message});
        let saveMessage = await newMessage.save();

        await ChatModel.findByIdAndUpdate( idChat, {$push: { messages: saveMessage.id }}, { new: true } );
        await ChatModel.findByIdAndUpdate( idChat, {$set: { lastmessage: saveMessage.id }}, { new: true } );

        // For Push Notifications
        const privateRoom: any = await PrivateRoom.getPrivateRoomByChatId(idChat, idLogguedUser );
        console.log('privateRoom' + privateRoom);
        const logguedUser: any = await User.getUser(idLogguedUser); // Chargue loggued user

        if (privateRoom) {
            console.log('dentro del if');
            if (privateRoom.addressee.onesignalid) {
                PushService.sendMessage(privateRoom.addressee.onesignalid, `${logguedUser.nick} say:`, `${message.content.substring(0, 25)}...` , { proomId: privateRoom.id });
            }
        }
        //////////////////

        return this.getMessage( saveMessage.id, idLogguedUser);
    }

    static getMessage( id: string, idLogguedUser: string ) {
        return new Promise( (resolve, reject) => {
            MessageModel.findById(id, (err, res) => {
                if (err) return reject(err);
                else {
                    let message = new Message(res);
                    
                    message.creator = new User(message.creator);
                    if(message.creator.id === idLogguedUser) message.mine = true;
                    else message.mine = false;

                    delete message.creator.password;
                    
                    resolve(message);
                }
            }).populate({ path: 'creator', ref: 'user'});
        });
    }
}