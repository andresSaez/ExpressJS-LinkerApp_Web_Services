import { Router, Request, Response } from 'express';
import { PrivateRoom } from '../classes/privateroom.class';

const router = Router();

/**
 * GET private-rooms/mine
 */
router.get('/mine', (req: Request, res: Response) => {
    PrivateRoom.getMyPrivateRooms(req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " +error});
    })
});

/**
 * POST private-rooms
 */
router.post('/', (req: Request, res: Response) => {
    PrivateRoom.createPrivateRoom(req.body.id, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " +error});
    });
});

/**
 * GET /private-rooms/:id
 */
router.get('/:id', (req: Request, res: Response) => {
    PrivateRoom.getPrivateRoom(req.params.id, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error });
    });
});


export { router as privateroomsRouter };