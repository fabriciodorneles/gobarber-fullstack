import { Router } from 'express';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

// o Patch te permite alterar UM campo do registro, o put pode alterar um ou mais
profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
