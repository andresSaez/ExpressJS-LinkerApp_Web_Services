import Server from './src/classes/server.class';
import { MongooseConnection } from './config/database.config';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { environment } from './environments/environment';
import Express from 'express';

/** IMPORT ROUTES */
import * as router from './src/routes';


/** CONNECT TO DATABASE */
const databaseConnection = new MongooseConnection();


/** PASSPORT CONFIG */
passport.use(new Strategy({secretOrKey: environment.token.secret, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()}, (payload, done) => {
    if (payload.id) {
        return done(null, {id: payload.id});
    } else {
        return done(new Error("Incorrect user"), null);
    }
}));


/** RUN SERVER */

const server = Server.instance;

// Passport initialize
server.app.use( passport.initialize() );

// BodyParser
server.app.use( bodyParser.json() );

// Cors
server.app.use( cors( { origin: true, credentials: true } ) );

// Fileupload
server.app.use( fileupload() );

server.app.use(environment.prefix + '/public/img/', Express.static('public/img'));
server.app.use(environment.prefix + '/auth', router.authRouter );
server.app.use(environment.prefix + '/users', passport.authenticate('jwt', {session: false}),router.usersRouter );
server.app.use(environment.prefix + '/rooms', passport.authenticate('jwt', {session: false}),router.roomsRouter );
server.app.use(environment.prefix + '/private-rooms', passport.authenticate('jwt', {session: false}),router.privateroomsRouter );
server.app.use(environment.prefix + '/messages', passport.authenticate('jwt', {session: false}),router.messagesRouter );
server.app.use(environment.prefix + '/chat', passport.authenticate('jwt', {session: false}),router.chatRouter );


server.start( () => {
    console.log(`Server listenning at port: ${ server.port }`);
});





