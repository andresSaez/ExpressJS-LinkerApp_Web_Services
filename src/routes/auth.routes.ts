import { Router, Request, Response } from 'express';
import Server from '../classes/server.class';
// import UserModel from '../models/user.model';
import { User } from '../classes/user.class';

const router = Router();

/**
 * GET /auth/validate
 */
router.get('/validate', ( req: Request , res: Response ) => {
    let resultado = User.validateToken(req.headers['authorization']);
  
    if (resultado)
      res.send({ok: true });
    else 
      res.status(401).send({error: true });
});

/**
 * POST /auth/login
 */
router.post('/login', ( req: Request , res: Response ) => {
    User.login(req.body).then( (result: any) => {
      res.send({error: false, accessToken: result });
    }).catch(e => {
      res.status(401).send({
        statusCode: 401,
        error: true,
        errorMessage: "Email or password incorrect"
      });
    });
});

/**
 * POST /auth/register
 */
router.post('/register', ( req: Request, res: Response ) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.nick)
      res.status(400).send({error: true, errorMessage: "Error: there can not be empty fields."});
    else {
      User.register(req.body).then(( result: any ) => {
        res.send({error: false, user: result.id });
      }).catch(error => {
        res.send({error: true, errorMessage: "Error: "+ error});
      });
    }
});

/**
 * POST /auth/google
 */
router.post('/google', ( req: Request, res: Response ) => {
  User.loginGoogle(req.body).then( (result: any) => {
    res.send({error: false, accessToken: result });
  }).catch( (error: any) => {
    res.status(401).send({
      statusCode: 401,
      error: true,
      errorMessage: "Something has failed: " + error
    });
  });
});

/**
 * POST /auth/facebook
 */
router.post('/facebook', ( req: Request, res: Response ) => {
  User.loginFacebook(req.body).then( (result: any ) => {
    res.send({error: false, accessToken: result });
  }).catch( (error: any) => {
    res.status(401).send({
      statusCode: 401,
      error: true,
      errorMessage: "Something has failed: " + error
    });
  });
});

export { router as authRouter };