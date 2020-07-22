import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'faractio',
            email: 'fara@gamil.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({ password: '123123', token: userToken.token });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({ password: '123123', token: 'non-existing-token' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(resetPassword.execute({ password: '1231231', token })).rejects.toBeInstanceOf(
            AppError,
        );
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'faractio',
            email: 'fara@gamil.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        // o mock substitui a função pela minha
        // quando o date for chamado, vai chamar a função que eu defini
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            // retorna a hora de agora setada com mais 3h
            return customDate.setHours(customDate.getHours() + 3);
        });

        // aí executa o reset como se estivesse 3h no futuro
        await expect(resetPassword.execute({ password: '123123', token })).rejects.toBeInstanceOf(
            AppError,
        );
    });
});

// Hash
// 2h de expiração
// user token inexistente
// user inexistente
