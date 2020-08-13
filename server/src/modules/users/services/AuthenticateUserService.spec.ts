import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const response = await authenticateUserService.execute({
            email: 'fara@gamil.com',
            password: '12346',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'fara@gamil.com',
                password: '12346',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await expect(
            authenticateUserService.execute({
                email: 'fara@gamil.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
