import express from 'express';
import { environment } from '../../environments/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = environment.server_port;

        this.httpServer = http.createServer( this.app );
        this.io = socketIO( this.httpServer );

        this.listenSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private listenSockets() {

        console.log('Listenning connections - sockets');

        this.io.on('connection', client => {

            // Conectar cliente
            socket.connectClient( client, this.io );
            
            // Messages
            socket.message(client, this.io );

            // Disconnect
            socket.disconnect( client, this.io );

        });
    }

    start( callback: Function ) {

        this.httpServer.listen( this.port, callback() );
    }
}