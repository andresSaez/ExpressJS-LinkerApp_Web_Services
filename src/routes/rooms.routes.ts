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
 * GET /rooms/me
 */
router.get('/me', (req: Request, res: Response) => {
    Room.getMyRooms(req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " +error});
    })
});

/**
 * GET /rooms/:id
 */
router.get('/:id', (req: Request, res: Response) => {
    Room.getRoom(req.params.id, req.user.id).then( (result: any) => {
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

/**
 * PUT /rooms/:id/image
 */
router.put('/:id/image', (req: Request, res: Response) => {
    if (!req.body.image)
        res.status(400).send({error: true, errorMessage: "No data has been sent or it is not correct"});
    else {
        Room.updateImage(req.body.image, req.params.id).then( (result: any) => {
            res.send({error: false, image: result.image });
        }).catch(error => {
            res.status(400).send({error: true, errorMessage: "Error: "+error});
        });
    }
});

/**
 * PUT /rooms
 */
router.put('/', ( req: Request, res: Response) => {
    Room.updateRoom(req.body).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " +error});
    });
});

/**
 * PUT /rooms/:id/add-member
 */
router.put('/:id/add-member', (req: Request, res: Response) => {
    Room.joinRoom(req.params.id, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error});
    });
});

export { router as roomsRouter };