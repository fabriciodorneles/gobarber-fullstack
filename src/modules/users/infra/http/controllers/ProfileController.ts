import { Response, Request } from 'express';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { container } from 'tsyringe';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        // Exibição do Perfil
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const { name, email, oldpassword, password } = request.body;

        const user_id = request.user.id;

        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            password,
            oldpassword,
        });

        delete user.password;

        return response.json(user);
    }
}
