// // import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it("should be able to list all the provider's appointments in day", async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'Gerso',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'Gerso',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });
        const appointment3 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'Gerso',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });

        const availability = await listProviderAppointments.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual([appointment1, appointment2, appointment3]);
    });
});
