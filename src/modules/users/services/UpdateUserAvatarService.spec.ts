import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeStorageProvider = new FakeStorageProvider();

        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

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
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'qualquercoisa.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when update newe one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

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
