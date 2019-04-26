import { Router, Request, Response } from 'express';
import { User } from '../classes/user.class';

const router = Router();

/**
 * GET /users
 */
router.get('/', (req: Request, res: Response) => {
    User.getUsers(req.user.id).then( (result: any) => {
        res.send({ error: false, users: result });
    }).catch(error => {
        res.send({ error: true, errorMessage: "Error: " +error });
    });
});

/**
 * GET /users/me
 */
router.get('/me', (req: Request, res: Response) => {
    User.getUser(req.user.id).then((result: any) => {
        if (result.id) {
            result.me = true;
            res.send({ error: false, user: result })
        } else
            res.status(404).send({error: true, errorMessage: "User not found"});     
    }).catch(error => {
        res.send({error: true, errorMessage: "Error: " + error});
    });
});

/**
 * GET /users/:id
 */
router.get('/:id', (req: Request, res: Response) => {
    User.getUser(req.params.id).then((result: any) => {
        if (result.id) {
            result.me = req.user.id === req.params.id;
            res.send({ error: false, user: result })
        } else
            res.status(404).send({error: true, errorMessage: "Usuar not found"});     
    }).catch(error => {
        res.status(404).send({error: true, errorMessage: "Error: " + error});
    });
});

/**
 * GET /users/me/friends
 */
router.get('/me/friends', (req: Request, res: Response) => {
    User.getFriends(req.user.id).then( (result: any) => {
        res.send({error: false, result: result })
    }).catch(error => {
        res.status(404).send({error: true, errorMessage: "Error: " +error});
    });
});

/**
 * PUT /users/me
 */
router.put('/me', (req: Request, res: Response) => {
    if (!req.body.name || !req.body.email || !req.body.nick) {
        res.status(400).send({error: true, errorMessage: "Email, name and nick can not be empty"});
    } else {
        User.updateUserInfo(req.user.id, req.body).then(result => {
            res.send({error: false, ok: true});
        }).catch(error => {
            res.status(400).send({error: true, errorMessage: "Error: " + error});
        });
    }
});

/**
 * PUT /users/me/avatar
 */
router.put('/me/avatar', (req: Request, res: Response) => {
    if (!req.body.avatar)
        res.status(400).send({error: true, errorMessage: "No data has been sent or it is not correct"});
    else {
        User.updateAvatar(req.user.id, req.body.avatar).then( (result: any) => {
            res.send({error: false, avatar: result.avatar });
        }).catch(error => {
            res.status(400).send({error: true, errorMessage: "Error: "+error});
        });
    }
});

/**
 * PUT /users/me/password
 */
router.put('/me/password', (req: Request, res: Response) => {
    if (!req.body.password) {
        res.status(400).send({error: true, errorMessage: "Password can not be empty"});
    } else {
        User.updatePassword(req.user.id, req.body.password).then(result => {
            res.send({error: false, ok: true});
        }).catch(error => {
            res.status(400).send({error: true, errorMessage: "Error: " + error});
        });
    }
});

/**
 * PUT /users/me/settings
 */
router.put('/me/settings', (req: Request, res: Response) => {
    if (!req.body)
        res.status(400).send({error: true, errorMessage: "No data has been sent or it is not correct"});
    else {
        User.updateSettings(req.user.id, req.body).then( (result: any) => {
            res.send({error: false, settings: result });
        }).catch(error => {
            res.status(400).send({error: true, errorMessage: "Error: "+error});
        });
    }
});

/**
 * DELETE /users/me
 */
router.delete('/me', (req: Request, res: Response) => {
    User.deleteUser(req.user.id).then((result: any) => {
        res.send({error: false, result: result.id });
    }).catch(error => {
        res.status(400).send({error: true, errorMessage: "Error: " + error });
    });
});

export { router as usersRouter };