import UserModel from '../models/user.model'; 
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import { environment } from '../../environments/environment';
import ImageService from '../services/image.service';
import { IUser } from '../interfaces/i-user.interface';
import { IChat } from '../interfaces/i-chat.interface';
import { IRoom } from '../interfaces/i-room.interface';
import { IPrivateRoom } from '../interfaces/i-private-room.interface';
import { ISettings } from '../interfaces/i-settings.interface';

//** GENERATE TOKEN */
let generarToken = (id: any) => {
    return jwt.sign({id: id}, environment.token.secret, {expiresIn: environment.token.expiresIn });
}

export class User implements IUser {

    id?: string;
    nick?: string;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    biography?: string;
    interests?: string[];
    lat?: number;
    lng?: number;
    connected?: boolean;
    friend?: boolean;
    lastconnection?: string;
    me?: boolean;
    onesignalid?: string;
    contacts?: IUser[];
    chats?: IChat[];
    rooms?: IRoom[];
    privaterooms?: IPrivateRoom[];
    settings?: ISettings;

    constructor( userJSON: any ) {
        this.id = userJSON && userJSON.id || null; 
        this.nick = userJSON && userJSON.nick || null;
        this.name = userJSON && userJSON.name || null;
        this.email = userJSON && userJSON.email || null;
        this.password = userJSON && userJSON.password || null;
        this.avatar = userJSON && userJSON.avatar || null;
        this.biography = userJSON && userJSON.biography || null;
        this.interests = userJSON && userJSON.interests || null;
        this.lat = userJSON && userJSON.lat || null;
        this.lng = userJSON && userJSON.lng || null;
        this.connected = userJSON && userJSON.connected || null;
        this.friend = userJSON && userJSON.friend || null;
        this.lastconnection = userJSON && userJSON.lastconnection || null;
        this.me = userJSON && userJSON.me || null;
        this.onesignalid = userJSON && userJSON.onesignalid || null;
        this.contacts = userJSON && userJSON.contacts || null;
        this.chats = userJSON && userJSON.chats || null;
        this.rooms = userJSON && userJSON.rooms || null;
        this.privaterooms = userJSON && userJSON.privaterooms || null;
        this.settings = userJSON && userJSON.settings || null;
    }

    static async login( user: IUser ) {

        let resultado = await UserModel.findOne({ $and: [ { name: { $eq: user.name }}, { email: { $eq: user.email }} ]} );

        let userEnt = new User(resultado);

        if (user.lat && user.lng) {
            userEnt.lat = user.lat;
            userEnt.lng = user.lng;
            // await User.updateCoords(userEnt);
        }
        
        return new Promise(( resolve, reject) => {
            if ( !resultado ) {
                return reject();
            }
            else {
                resolve(generarToken(userEnt.id));
            }
        });
    }

    static async register( user: IUser ) {
        let emailExist = await User.emailExists( user.email );

        if (!emailExist) {
            user.avatar = 'public/img/users/default-profile.jpg';
            user.password = md5(<any>user.password);
        }

        if (emailExist) {
            return new Promise( (resolve, reject ) => reject('Email already exists'));
        } 

        let newUser = new UserModel({...user});
        console.log(newUser);

        return newUser.save();
    }

    static async emailExists( email: any ) {
        let result = await UserModel.findOne({ email: { $eq: email }});

        return new Promise(( resolve, reject ) => {
            resolve(!!result);
        });
    }

    static validateToken( token: any ) {
        try {
            let tokenWithoutBearer = token.split(' ');
            let result = jwt.verify( tokenWithoutBearer[1], environment.token.secret );
            return result;
        } catch (e) {}
    }
}