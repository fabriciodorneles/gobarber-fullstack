import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionRouter = Router();
const sessionsController = new SessionsController();
// então aqui tá criando uma session
sessionRouter.post('/', sessionsController.create);

export default sessionRouter;
