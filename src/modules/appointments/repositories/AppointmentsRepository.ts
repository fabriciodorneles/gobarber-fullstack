import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment = await this.findOne({
            // where: { date: date },
            where: { date },
        });
        // se tiver o findAppointment retorna, senão retorna  nulo
        return findAppointment || null;
    }
}

export default AppointmentsRepository;
