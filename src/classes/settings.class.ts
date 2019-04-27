import { ISettings } from "../interfaces/i-settings.interface";



export class Settings implements ISettings {

    id?: string;
    privacity?: any;
    notifications?: any;
    language?: any;

    constructor( settingsJSON: any ) {
        this.id = settingsJSON && settingsJSON.id || null; 
        this.privacity = settingsJSON && settingsJSON.privacity || null;
        this.notifications = settingsJSON && settingsJSON.notifications || null;
        this.language = settingsJSON && settingsJSON.language || null;
    }

}