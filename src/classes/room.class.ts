import { IRoom } from "../interfaces/i-room.interface";
import { Chat } from "./chat.class";
import RoomModel from "../models/room.model";
import { User } from "./user.class";
import { HelpersService } from "../services/helpers.service";

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
        console.log('estoy aqui');
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
    static getRoom( idRoom: any, logguedUserId: any ) {
        return new Promise( (resolve, reject) => {

        });
    }

    /**
     * GET_MY_ROOMS
     * @param logguedUserId 
     */
    static getMyRooms( logguedUserId: any ) {
        return new Promise( (resolve, reject) => {

        });
    }

    /**
     * UPDATE_ROOM
     * @param idRoom 
     */
    static updateRoom( room: any ) {
        return new Promise( (resolve, reject) => {

        });
    }

}