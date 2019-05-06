import { IPrivateRoom } from "../interfaces/i-private-room.interface";
import { Chat } from "./chat.class";
import RoomModel from "../models/room.model";
import UserModel from "../models/user.model";
import PrivateroomModel from "../models/privateroom.model";
import { User } from "./user.class";
import { Message } from "./message.class";


export class PrivateRoom implements IPrivateRoom {

    id?: string;
    chat?: any; // or string?
    members?: string[];
    addressee?: any;


    constructor( proomJSON: any ) {
        this.id = proomJSON && proomJSON.id || null; 
        this.chat = proomJSON && proomJSON.chat || null;
        this.members = proomJSON && proomJSON.members || null;
    }


    /**
     * CREATE_PRIVATE_ROOM
     * @param room 
     * @param creator 
     */
    static async createPrivateRoom( userId: any, logguedUserId: any) {
        let chat: any = await Chat.newChat();

        console.log('userID: ', userId);

        console.log('chat: ', chat);

        let privateRoom: IPrivateRoom = {
            chat: chat.id,
            members: [logguedUserId, userId]
        };

        console.log('private-room: ', privateRoom);

        // let roomEnt = new PrivateRoom(privateRoom);

        let newPrivateRoom = new PrivateroomModel({...privateRoom});
        let saveRoom = await newPrivateRoom.save();

        console.log('saveRoom: ', saveRoom );

        await UserModel.findByIdAndUpdate( userId, {$push: { privaterooms: saveRoom.id } }, { new: true } );
        await UserModel.findByIdAndUpdate( logguedUserId, {$push: { privaterooms: saveRoom.id } }, { new: true } );

        return new Promise((resolve, reject) => {
            PrivateroomModel.findById(saveRoom.id, (err, res) => {
                if (err) return reject(err)
                else {
    
                    resolve(new PrivateRoom(res));
                }
            });
        });     
    }

    /**
     * GET_MY_PRIVATE_ROOMS
     * @param logguedUserId 
     */
    static async getMyPrivateRooms( logguedUserId: any ) {
        let logguedUser: any = await User.getUser(logguedUserId);

        return new Promise( (resolve, reject) => {
            PrivateroomModel.find({ _id: { $in: logguedUser.privaterooms } }, (err, res) => {
                if (err) return reject(err);
                else {
                    let rooms = res.map(roomJSON => new PrivateRoom(roomJSON)).map( (r: any) => {
                        // console.log(r.members);
                        r.members = r.members.map( (userJSON: any) => new User(userJSON));
                        r.chat = new Chat(r.chat);
                        r.chat.lastmessage = new Message(r.chat.lastmessage);
                        r.chat.lastmessage.creator = new User(r.chat.lastmessage.creator);
                        r.addressee = r.members.filter( (el: any) => el.id !== logguedUserId);
                        r.addressee = r.addressee[0];
                        return r;
                    });
                    resolve(rooms);
                }
            }).populate({path: 'members', model: 'user'}).populate({path: 'chat', populate: { path: 'lastmessage', populate: { path: 'creator' }}});
        });
        
    }

    /**
     * GET_PRIVATE_ROOM
     * @param idRoom 
     * @param logguedUserId 
     */
    static async getPrivateRoom( idRoom: any, logguedUserId: any ) {
        // let logguedUser: any = await User.getUser(logguedUserId);
        return new Promise( (resolve, reject) => {
            PrivateroomModel.findById( idRoom, (err, res) => {
                if (err) return reject(err);
                else {
                    let room: any = new PrivateRoom(res);
                    
                    room.members = room.members.map( (userJSON: any) => new User(userJSON));
                    room.chat = new Chat(room.chat);
                    room.chat.lastmessage = new Message(room.chat.lastmessage);
                    room.chat.lastmessage.creator = new User(room.chat.lastmessage.creator);
                    room.addressee = room.members.filter( (el: any) => el.id !== logguedUserId);
                    room.addressee = room.addressee[0];
                    resolve(room);
                }
            }).populate({path: 'members', model: 'user'}).populate({path: 'chat', populate: { path: 'lastmessage', populate: { path: 'creator' }}});
        });
    }

}