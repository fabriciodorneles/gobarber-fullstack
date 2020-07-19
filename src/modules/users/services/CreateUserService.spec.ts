import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('qualquercoisa1221');
    });

    it('should not be able to create a new user with same email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        expect(
            createUserService.execute({
                name: 'qualquercoisa1221',
                email: 'fara@gamil.com',
                password: '12346',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
