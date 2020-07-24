import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            user_id: 'qualquer_cliente',
            provider_id: 'qualquercoisa1221',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('qualquercoisa1221');
    });

    it('should not be able to create two appointments on the same time', async () => {
        // 2020 ,maio(pq jan é 0), dia 10, 11 da manhã
        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: 'qualquer_cliente',
            provider_id: 'qualquercoisa1221',
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: 'qualquer_cliente',
                provider_id: 'qualquercoisa1221',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
