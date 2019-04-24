import mongoose from 'mongoose';
import { environment } from '../environments/environment';

const connection = `mongodb://${environment.database.host}:${environment.database.port}/${environment.database.database}`;

export class MongooseConnection {

    conexion = connection;

    constructor() {
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect( this.conexion, { useNewUrlParser: true });
    }
}