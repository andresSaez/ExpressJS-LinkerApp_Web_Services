import { IRoom } from "../interfaces/i-room.interface";
import { Chat } from "./chat.class";
import RoomModel from "../models/room.model";
import { User } from "./user.class";
import { HelpersService } from "../services/helpers.service";
import UserModel from "../models/user.model";

export class Room implements IRoom {

    id?: string;
    creator?: any; // or string
    name?: string;
    description?: string;
    image?: string;
    hastags?: string[];
    date?: string; // or date
    lat?: number;
    lng?: number;
    members?: any; // Or string[]
    chat?: any; // or string?
    mine?: boolean;
    distance?: number;

    constructor( roomJSON: any ) {
        this.id = roomJSON && roomJSON.id || null; 
        this.creator = roomJSON && roomJSON.creator || null;
        this.name = roomJSON && roomJSON.name || null;
        this.description = roomJSON && roomJSON.description || null;
        this.image = roomJSON && roomJSON.image || null;
        this.hastags = roomJSON && roomJSON.hastags || null;
        this.date = roomJSON && roomJSON.date || null;
        this.lat = roomJSON && roomJSON.lat || null;
        this.lng = roomJSON && roomJSON.lng || null;
        this.members = roomJSON && roomJSON.members || [];
        this.chat = roomJSON && roomJSON.chat || null;
        this.mine = roomJSON && roomJSON.mine || null;
        this.distance = roomJSON && roomJSON.distance || null;
    }


    /**
     * CREATE_ROOM
     * @param room 
     * @param creator 
     */
    static async createRoom( room: any, creator: any) {
        let chat: any = await Chat.newChat();
        let roomEnt = new Room({...room});
        roomEnt.chat = chat.id;
        roomEnt.members.push(creator);
        roomEnt.creator = creator;

        let newRoom = new RoomModel({...roomEnt});

        return new Promise( (resolve, reject) => {
            newRoom.save({}, (err, res) => {
                if (err) return reject(err);
                else {
                    resolve(res);
                }
            });
        }); 
    }

    /**
     * GET_ROOMS
     * @param id 
     */
    static async getRooms( id: any ) {
        let logguedUser: any = await User.getUser(id);
        return new Promise( (resolve, reject) => {
            RoomModel.find({}, (err, res) => {
                if (err) return reject(err);
                else {
                    let rooms = res.map(roomJSON => new Room(roomJSON)).map( (r: any) => {
                        r.creator = new User(r.creator);
                        delete r.creator.password;
                        r.distance = HelpersService.getDistance(logguedUser.lat, logguedUser.lng, r.lat, r.lng);
                        return r;
                    });
                    resolve(rooms);
                }
            }).populate('creator');
        });
    }

    /**
     * GET_ROOM
     * @param idRoom 
     * @param logguedUserId 
     */
    static async getRoom( idRoom: any, logguedUserId: any ) {
        let logguedUser: any = await User.getUser(logguedUserId);
        return new Promise( (resolve, reject) => {
            RoomModel.findById( idRoom, (err, res) => {
                if (err) return reject(err);
                else {
                    let room = new Room(res);
                    room.mine = false;
                    room.distance = HelpersService.getDistance(logguedUser.lat, logguedUser.lng, room.lat, room.lng);
                    room.creator = new User(room.creator);
                    if (room.creator.id === logguedUserId) {
                        room.mine = true;
                    }
                    resolve(room);
                }
            }).populate('creator');
        });
    }

    /**
     * GET_MY_ROOMS
     * @param logguedUserId 
     */
    static async getMyRooms( logguedUserId: any ) {
        let logguedUser: any = await User.getUser(logguedUserId);

        return new Promise( (resolve, reject) => {
            RoomModel.find({ creator: logguedUserId}, (err, res) => {
                if (err) return reject(err);
                else {
                    let rooms = res.map(roomJSON => new Room(roomJSON)).map( (r: any) => {
                        r.distance = HelpersService.getDistance(logguedUser.lat, logguedUser.lng, r.lat, r.lng);
                        return r;
                    });
                    resolve(rooms);
                }
            });
        });
        
    }

    /**
     * UPDATE_ROOM
     * @param room 
     */
    static updateRoom( room: any ) {
        return RoomModel.findByIdAndUpdate( room.id, {$set: {...room} }, { new: true});
    }


    static async joinRoom( idSala: any, logguedUserId: any ) {
        await UserModel.findByIdAndUpdate( logguedUserId, {$push: { rooms: idSala } }, { new: true } );

        return RoomModel.findByIdAndUpdate( idSala, {$push: { members: logguedUserId}}, { new: true } );
    }

}