import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// Isso é um  DTO
interface Request {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    // teve que transformar a função em assíncrone e ajustar o retorno para promise
    public async execute({ provider, date }: Request): Promise<Appointment> {
        // função pronta do typeORM
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw Error('This appointment is already booked');
        }

        // função do typeORM também, mas não precisa await por ele ainda não salva no BD
        const appointment = appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        // aqui ele salva
        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
