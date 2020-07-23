import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    oldpassword?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ user_id, name, email, password, oldpassword }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not Found');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('E-mail already in use.');
        }

        user.name = name;
        user.email = email;

        if (password && !oldpassword) {
            throw new AppError('You need to inform the old password to set a new password.');
        }

        if (password && oldpassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldpassword,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError('Old password does not match.');
            }
            user.password = await this.hashProvider.generateHash(password);
        }

        console.log(user);
        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
