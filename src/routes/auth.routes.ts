import { Router, Request, Response } from 'express';
import Server from '../classes/server.class';

const router = Router();

router.get('/hola', ( req: Request , res: Response ) => {
    res.send({ ok: true,
            message: 'Todo está ok'
    });
});

/**
 * GET /auth/validate
 */
router.get('/validate', ( req: Request , res: Response ) => {
    // let resultado = User.validarToken(req.headers['authorization']);
  
    // if (resultado)
    //   res.send({ok: true });
    // else 
    //   res.status(401).send({error: true });
});

/**
 * POST /auth/login
 */
router.post('/login', ( req: Request , res: Response ) => {
    // User.login(req.body).then(resultado => {
    //   res.send({error: false, accessToken: resultado });
    // }).catch(e => {
    //   res.status(401).send({
    //     statusCode: 401,
    //     error: true,
    //     errorMessage: "Email or password incorrect"
    //   });
    // });
});





export { router as authRouter };