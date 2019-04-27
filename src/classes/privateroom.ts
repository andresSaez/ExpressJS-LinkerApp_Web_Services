import { IPrivateRoom } from "../interfaces/i-private-room.interface";


export class PrivateRoom implements IPrivateRoom {

    id?: string;
    chat: any; // or string?

    constructor( proomJSON: any ) {
        this.id = proomJSON && proomJSON.id || null; 
        this.chat = proomJSON && proomJSON.chat || null;
    }
}