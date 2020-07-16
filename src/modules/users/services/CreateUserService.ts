import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUsersService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkUsersExists = await this.usersRepository.findByEmail(email);
        if (checkUsersExists) {
            throw new AppError('Email adress already used');
        }
        const hashedPassword = await hash(password, 8);
        const user = this.usersRepository.create({ name, email, password: hashedPassword });
        return user;
    }
}

export default CreateUsersService;
