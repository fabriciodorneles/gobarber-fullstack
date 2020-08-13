import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const showUser = await showProfile.execute({
            user_id: user.id,
        });

        expect(showUser.name).toBe('qualquercoisa1221');
        expect(showUser.email).toBe('fara@gamil.com');
    });

    it('should not be able to show the profile of a non-existing user', async () => {
        expect(
            showProfile.execute({
                user_id: 'wrong_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
