import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUsersService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User); // pega o repositório padrão do typeorm sem precisar criar

        const checkUsers = await usersRepository.findOne({
            where: { email }, // email : email -> email = email
        });

        if (checkUsers) {
            throw new AppError('Email adress already used');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUsersService;
