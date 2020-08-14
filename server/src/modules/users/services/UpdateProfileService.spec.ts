import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Johnny Pulittle',
            email: 'johnnyP@gmail.com',
        });

        expect(updatedUser.name).toBe('Johnny Pulittle');
    });

    it('should not be able to update the profile of a non-existing user', async () => {
        expect(
            updateProfile.execute({
                user_id: 'wrong_id',
                name: 'Johnny Pulittle',
                email: 'johnnyP@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change email to a existent email', async () => {
        await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const user = await fakeUsersRepository.create({
            name: 'amigao',
            email: 'amigo@gmail.com',
            password: '12346',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Amigao Amigo',
                email: 'fara@gamil.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Johnny Pulittle',
            email: 'johnnyP@gmail.com',
            old_password: '12346',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without the old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Johnny Pulittle',
                email: 'johnnyP@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Johnny Pulittle',
                email: 'johnnyP@gmail.com',
                old_password: 'wrong_old_password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
