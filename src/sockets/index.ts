import { Socket } from 'socket.io';
import { IMessage } from '../interfaces/i-message.interface';
import { Message } from '../classes/message.class';


export const connectClient = ( client: Socket, io: SocketIO.Server ) => {
    console.log('cliente conectado');
}

export const disconnect = ( client: Socket, io: SocketIO.Server ) => {
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
}

// Listen messages
export const message = ( client: Socket, io: SocketIO.Server ) => {

    client.on('message', ( payload: { message: IMessage, chat: string } ) => {
        console.log('message recived');
        console.log('payload: ' + payload);

        io.emit('new-message', payload );
    })
}