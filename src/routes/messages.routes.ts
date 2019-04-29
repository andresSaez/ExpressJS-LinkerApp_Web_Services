import { Router, Request, Response } from 'express';
import { Message } from '../classes/message.class';

const router = Router();

/**
 * POST /messages/:id
 */
router.post('/:id', (req: Request, res: Response) => {
    Message.newMessage(req.body, req.params.id, req.user.id).then( (result: any) => {
        res.send({ error: false, result: result });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage:"Error: " +error});
    });
});

export { router as messagesRouter };