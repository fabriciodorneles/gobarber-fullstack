import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

// Isso é um  DTO
interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    // teve que transformar a função em assíncrone e ajustar o retorno para promise
    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        // função pronta do typeORM
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        // função do typeORM também, mas não precisa await por ele ainda não salva no BD
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        // aqui ele salva
        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
 