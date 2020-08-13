import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;
let createUserService: CreateUserService;
let updateUserAvatar: UpdateUserAvatarService;
let fakeCacheProvider: FakeCacheProvider;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        fakeHashProvider = new FakeHashProvider();
        fakeStorageProvider = new FakeStorageProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    it('should be able to update user avatar', async () => {
        const user = await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'qualquercoisa.jpg',
        });

        expect(user.avatar).toBe('qualquercoisa.jpg');
    });

    it('should not be able to update user avatar from non-existing user', async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'qualquercoisa.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when update newe one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const user = await createUserService.execute({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'qualquercoisa.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'nova_qualquercoisa.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('qualquercoisa.jpg');
        expect(user.avatar).toBe('nova_qualquercoisa.jpg');
    });
});
