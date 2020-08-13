// // import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeUsersRepository = new FakeUsersRepository();
        listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
    });

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'qualquercoisa1221',
            email: 'fara@gamil.com',
            password: '12346',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'querelo',
            email: 'quecola@gamil.com',
            password: '12346',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Ratin',
            email: 'rato@gmail.com',
            password: '12346',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
