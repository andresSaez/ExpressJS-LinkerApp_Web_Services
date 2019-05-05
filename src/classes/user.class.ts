import UserModel from '../models/user.model'; 
import SettingsModel from '../models/settings.model';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
const rp = require('request-promise');
import { environment } from '../../environments/environment';
import ImageService from '../services/image.service';
import AuthService from '../services/auth.service';
import { IUser } from '../interfaces/i-user.interface';
import { IChat } from '../interfaces/i-chat.interface';
import { IRoom } from '../interfaces/i-room.interface';
import { IPrivateRoom } from '../interfaces/i-private-room.interface';
import { ISettings } from '../interfaces/i-settings.interface';
import { Settings } from './settings.class';
import RoomModel from '../models/room.model';
import { Room } from './room.class';

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
    contacts?: string[];
    chats?: string[];
    rooms?: string[];
    privaterooms?: string[];
    settings?: string;

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

    /**
     * LOGIN
     * @param user 
     */
    static async login( user: IUser ) {

        let resultado = await UserModel.findOne({ $and: [ { password: { $eq: md5(<string>user.password) }}, { email: { $eq: user.email }} ]} );

        let userEnt = new User(resultado);

        if (user.lat && user.lng) {
            userEnt.lat = user.lat;
            userEnt.lng = user.lng;
            await User.updateCoords(userEnt);
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

    /**
     * REGISTER
     * @param user 
     */
    static async register( user: IUser ) {
        let emailExist = await User.emailExists( user.email );

        if (!emailExist) {
            user.password = md5(<any>user.password);
            user.avatar = "public/img/users/default-profile.jpg";
        }

        if (emailExist) {
            return new Promise( (resolve, reject ) => reject('Email already exists'));
        } 

        let defaultSettings = await User.setDefaultSettings();
        user.settings = defaultSettings.id;

        let newUser = new UserModel({...user});

        return newUser.save();
    }

    /**
     * LOGIN_FACEBOOK
     * @param tokenDto 
     */
    static async loginFacebook(tokenDto: any) {
        const options = {
            method: 'GET',
            uri: 'https://graph.facebook.com/me',
            qs: {
                access_token: tokenDto.token,
                fields: 'id,name,email',
            },
            json: true,
        };
        const respUser = await rp(options);

        let user: any = await User.getUserByEmail(respUser.email);

        if (!user) {
            const optionsImg = {
                method: 'GET',
                uri: 'https://graph.facebook.com/me/picture',
                qs: {
                    access_token: tokenDto.token,
                    type: 'large',
                },
            };
            const respImg = rp(optionsImg);
            const avatar = await ImageService.downloadImage('users', respImg.url);
            user = {
                email: respUser.email,
                name: respUser.name,
                avatar: avatar,
                lat: tokenDto.lat ? tokenDto.lat : 0,
                lng: tokenDto.lng ? tokenDto.lng : 0,
            };
            user = await User.saveUser(user);
        } else if (tokenDto.lat && tokenDto.lng) {
            user.lat = tokenDto.lat;
            user.lng = tokenDto.lng;
            await User.updateCoords(user);
        }

        let usuarioComprobado: any = await User.getUserByEmail(respUser.email);

        return generarToken(usuarioComprobado.id);
    }

    /**
     * LOGIN_GOOGLE
     * @param datosUser 
     */
    static async loginGoogle(datosUser: any) {
        const datosToken: any = await AuthService.comprobarTokenGoogle(datosUser.token);

        let user: any = await User.getUserByEmail(datosToken.emails[0].value);

        const avatar = await ImageService.downloadImage('users', datosToken.image.url);

        if (!user) {
            let newUser = {
                name : datosToken.name.givenName,
                avatar : avatar,
                email : datosToken.emails[0].value,
                lat : datosUser.lat ? datosUser.lat : 0,
                lng : datosUser.lng ? datosUser.lng : 0,
            }
            await User.saveUser(newUser);
        } else if(datosUser.lat && datosUser.lng) {
            user.lat = datosUser.lat;
            user.lng = datosUser.lng;
            await User.updateCoords(user);
        }
        
        let usuarioComprobado: any = await User.getUserByEmail(datosToken.emails[0].value);

        return generarToken(usuarioComprobado.id);
    }

    /**
     * GET_USERS
     */
    static getUsers(id: any ) {
        return new Promise( (resolve, reject) => {
            UserModel.find( {}, ( err, res ) => {

                if (err) {
                    return reject(err);
                }
                else {
                    resolve(res.map(uJSON => new User(uJSON)).map( (u: any) => {

                        delete u.password;
                        return u;
                    }));
                }
            });
        });
    }

    /**
     * GET_USER
     * @param id 
     */
    static async getUser( id: any, idLogguedUser? : any ) {
        return new Promise( (resolve, reject) => {
            UserModel.findById(id, ( err, res ) => {

                if (err) {
                    return reject(err);
                }
                else {
                    let result: any = new User(res);
                    result.contacts = result.contacts.map( (userJSOn: any) => new User(userJSOn));
                    result.friend = false;
                    result.settings = new Settings(result.settings);

                    if (idLogguedUser) {
                        result.contacts.forEach( (element: any) => {
                            if (element.id === idLogguedUser )
                                result.friend = true;
                        });
                    } 
                    
                    resolve(result);
                }
            }).populate('settings').populate('contacts');
        });
    }

    /**
     * GET_FRIENDS
     * @param id 
     */
    static getFriends( id: any ) {
        return new Promise( (resolve, reject) => {
            UserModel.findById(id, ( err, res ) => {
                if (err) {
                    return reject(err);
                }
                else {
                    let user: any = new User(res);
                    let contactos = user.contacts.map( (c: any) => new User(c)).map( (cont: any) => {
                        delete cont.password;
                        delete cont.friend;
                        delete cont.me;
                        return cont;
                    });
                    resolve(contactos);
                }
            }).populate('contacts');
        });
    }

    /**
     * GET_BLOCKED_USERS
     * @param id 
     */
    static async getBlockedUsers( id: any ) {
        const logguedUserSettings: any = await this.getSettings(id);

        console.log(logguedUserSettings.privacity.blockedusers);

        return new Promise( (resolve, reject) => {
            UserModel.find({ _id: {$in: logguedUserSettings.privacity.blockedusers }}, (err, res) => {
                if (err) return reject(err);
                else {
                    const result: any = res.map( (userJSON) => new User(userJSON));

                    resolve(result);
                }
            });
        });
    }

    /**
     * GET_ROOM_EXCEPTIONS
     * @param id 
     */
    static async getRoomExceptions( id: any ) {
        const logguedUserSettings: any = await this.getSettings(id);

        console.log(logguedUserSettings.notifications.rooms.exceptions);

        return new Promise( (resolve, reject) => {
            RoomModel.find({ _id: {$in: logguedUserSettings.notifications.rooms.exceptions }}, (err, res) => {
                if (err) return reject(err);
                else {
                    const result: any = res.map( (roomJSON) => new Room(roomJSON));

                    resolve(result);
                }
            });
        });
    }

    /**
     * GET_PROOM_EXCEPTIONS
     * @param id 
     */
    static async getPrivateRoomExceptions( id: any ) {
        const logguedUserSettings: any = await this.getSettings(id);

        console.log(logguedUserSettings.notifications.private.exceptions);

        return new Promise( (resolve, reject) => {
            UserModel.find({ _id: {$in: logguedUserSettings.notifications.private.exceptions }}, (err, res) => {
                if (err) return reject(err);
                else {
                    const result: any = res.map( (userJSON) => new User(userJSON));

                    resolve(result);
                }
            });
        });
    }

    /**
     * GET_USER_BY_EMAIL
     * @param email 
     */
    static getUserByEmail( email: any ) {
        return new Promise( (resolve, reject) => {
            UserModel.findOne({ email: { $eq: email } }, (err, res) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(new User(res));
                }
            });
        });
    }

    /**
     * GET_SETTINGS
     * @param id 
     */
    static async getSettings( id: any ) {
        let logguedUser: any = await User.getUser(id);

        return new Promise( (resolve, reject) => {
            SettingsModel.findById(logguedUser.settings.id, (err, res) => {
                if (err) {
                    return reject(err);
                }
                else {
                    console.log(res);
                    let result: any = new Settings(res);

                    console.log(result);
                    // result.privacity.blockedusers = result.privacity.blockedusers.map( (userJSOn: any) => { new User(userJSOn); });
                    // result.notifications.private.exceptions = result.notifications.private.exceptions.map( (proomJSOn: any) => new PrivateRoom(proomJSOn));
                    // result.notifications.rooms.exceptions = result.notifications.rooms.exceptions.map( (roomJSOn: any) => new Room(roomJSOn));

                    resolve(result);
                }
            });
                // .populate({path: 'notifications.private.exceptions', model: 'privateroom'})
                // .populate({path: 'notifications.rooms.exceptions', model: 'room'});
        });
    }

    /**
     * GET_USER_SETTINGS
     * @param idUser 
     */
    static async getUserSettings( idUser: any ) {
        
    }

    /**
     * UPDATE_USER_INFO
     * @param id 
     * @param user 
     */
    static updateUserInfo( id: any, user: IUser ) {
        console.log(user);
        const newUserInfo = {
            nick: user.nick,
            name: user.name,
            email: user.email,
            interests: user.interests,
            biography: user.biography,
            lat: user.lat,
            lng: user.lng,
        };
        return UserModel.findByIdAndUpdate( id, {$set: {...newUserInfo} }, { new: true});
    }

    /**
     * UPDATE_PASSWORD
     * @param id 
     * @param pass 
     */
    static updatePassword( id: any, pass: any ) {
        return UserModel.findByIdAndUpdate( id, {$set: { password: md5(pass) }}, { new: true } );
    }

    /**
     * UPDATE_AVATAR
     * @param id 
     * @param avatar 
     */
    static async updateAvatar( id: any, avatar: any ) {
        avatar = await ImageService.saveImage('users', avatar);

        return UserModel.findByIdAndUpdate( id, {$set: { avatar: avatar }}, { new: true } );
    }

    /**
     * UPDATE_SETTINGS
     * @param id 
     * @param settings 
     */
    static async updateSettings( id: any, settings: any ) {
        // console.log(settings);
        // const updateSettings = new Settings({...settings});
        // console.log(updateSettings);
        const logguedUser: any = await User.getUser(id);
        console.log(settings.privacity.blockedusers);
        const updateSettings = {
            ...settings,
            privacity: {
                ...settings.privacity,
                blockedusers: [...settings.privacity.blockedusers]
            },
            notifications: {
                private: {
                    ...settings.notifications.private,
                    exceptions: [...settings.notifications.private.exceptions]
                },
                rooms: {
                    ...settings.notifications.rooms,
                    exceptions: [...settings.notifications.rooms.exceptions]
                }
            }
        }

        console.log(updateSettings);

        return SettingsModel.findByIdAndUpdate( logguedUser.settings.id, {$set: {...updateSettings} }, { new: true });
    }

    /**
     * UPDATE_COORDS
     * @param user 
     */
    static updateCoords( user: IUser ) {
        return UserModel.findByIdAndUpdate( user.id, {$set: { lat: user.lat, lng: user.lng }}, { new: true } );
    }

    /**
     * ADD_FRIEND
     * @param idFriend 
     * @param idLogguedUser 
     */
    static async addFriend( idFriend: any, idLogguedUser: any ) {
        await UserModel.findByIdAndUpdate( idFriend, {$push: { contacts: idLogguedUser } }, { new: true } );
        return UserModel.findByIdAndUpdate( idLogguedUser, {$push: { contacts: idFriend } }, { new: true } );
    }

    /**
     * DELETE_USER
     * @param id 
     */
    static async deleteUser( id: any ) {
        // return UserModel.findByIdAndRemove(id);
        await UserModel.findByIdAndUpdate( id, {$set: { avatar: 'public/img/users/default-profile.jpg' }}, { new: true } );
        return UserModel.findByIdAndUpdate( id, {$set: { email: 'deleted@email.com' }}, { new: true } );
    }

    /**
     * EMAIL_EXISTS
     * @param email 
     */
    static async emailExists( email: any ) {
        let result = await UserModel.findOne({ email: { $eq: email }});

        return new Promise(( resolve, reject ) => {
            resolve(!!result);
        });
    }

    /**
     * SET_DEFAULT_SETTINGS
     */
    static setDefaultSettings() {
        const defaultSettings = new SettingsModel();

        return defaultSettings.save();
    }

    /**
     * SAVE_USER
     * @param user 
     */
    static saveUser( user: any ) {
        return new Promise((resolve, reject) => {
            delete user.token;
            let newUser = new UserModel({...user});
            newUser.save({}, (err, res) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    /**
     * VALIDATE_TOKEN
     * @param token 
     */
    static validateToken( token: any ) {
        try {
            let tokenWithoutBearer = token.split(' ');
            let result = jwt.verify( tokenWithoutBearer[1], environment.token.secret );
            return result;
        } catch (e) {}
    }
}