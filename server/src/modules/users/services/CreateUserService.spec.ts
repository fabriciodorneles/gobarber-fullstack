import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('qualquercoisa1221');
    });

    it('should not be able to create a new user with same email', async () => {
        await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await expect(
            createUserService.execute({
                name: 'qualquercoisa1221',
                email: 'fara@gamil.com',
                password: '12346',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
