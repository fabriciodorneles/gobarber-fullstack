import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUsersService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig); // upload se torna uma instância do multer

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUsersService();

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    // delete user.password;

    return response.json(user);
});

// o Patch te permite alterar UM campo do registro, o put pode alterar um ou mais
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json({ user });
    },
);

export default usersRouter;
