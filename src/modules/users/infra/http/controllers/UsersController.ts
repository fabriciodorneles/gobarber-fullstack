import { Response, Request } from 'express';
import CreateUsersService from '@modules/users/services/CreateUserService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUsersService);

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        // delete user.password;

        return response.json({ user: classToClass(user) });
    }
}
