import { Router, Request, Response } from 'express';
import { Room } from '../classes/room.class';

const router = Router();

/**
 * GET /rooms
 */
router.get('/', (req: Request, res: Response) => {
    Room.getRooms(req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error });
    });
});

/**
 * GET /rooms/:id
 */
router.get('/:id', (req: Request, res: Response) => {
    Room.getRoom(req.body.id, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error });
    });
});

/**
 * POST /rooms
 */
router.post('/', (req: Request, res: Response) => {
    Room.createRoom(req.body, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " +error});
    });
});

export { router as roomsRouter };