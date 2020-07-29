import { Response, Request } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
    public async update(request: Request, response: Response): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json({ user: classToClass(user) });
    }
}
