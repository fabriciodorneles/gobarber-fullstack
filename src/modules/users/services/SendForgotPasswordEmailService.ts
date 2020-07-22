import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists.');
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de Senha',
            templateData: {
                template: 'Olá, {{name}}: {{token}}',
                variables: {
                    name: user.name,
                    token,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
