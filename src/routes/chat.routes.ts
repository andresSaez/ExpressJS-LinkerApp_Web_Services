import { Router, Request, Response } from 'express';
import { Chat } from '../classes/chat.class';

const router = Router();

/**
 * GET /chat/:id
 */
router.get('/:id', (req: Request, res: Response) => {
    Chat.getChat(req.params.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error});
    });
});

/**
 * POST /chat
 */
router.post('/', (req: Request, res: Response) => {
    Chat.newChat().then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({ error: true, errorMessage: "Error: " +error});
    });
});

export { router as chatRouter };