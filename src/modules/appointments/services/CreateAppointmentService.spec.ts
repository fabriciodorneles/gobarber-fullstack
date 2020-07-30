import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'qualquer_cliente',
            provider_id: 'qualquercoisa1221',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('qualquercoisa1221');
    });

    it('should not be able to create two appointments on the same time', async () => {
        // 2020 ,maio(pq jan é 0), dia 10, 11 da manhã
        const appointmentDate = new Date(2020, 4, 10, 13);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: 'qualquer_cliente',
            provider_id: 'qualquercoisa1221',
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: 'qualquer_cliente',
                provider_id: 'qualquercoisa1221',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: 'qualquer_cliente',
                provider_id: 'qualquercoisa1221',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 14),
                user_id: 'barbeiro jonhy',
                provider_id: 'barbeiro jonhy',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8AM and after 5PM', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 9, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 7),
                user_id: 'qualquercoisa1221',
                provider_id: 'barbeiro jonhy',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 18),
                user_id: 'qualquercoisa1221',
                provider_id: 'barbeiro jonhy',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
