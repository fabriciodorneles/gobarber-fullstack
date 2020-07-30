import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointmentsInDay = await this.cacheProvider.recover<Appointment[]>(cacheKey);

        if (!appointmentsInDay) {
            appointmentsInDay = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id,
                day,
                month,
                year,
            });
            await this.cacheProvider.save(cacheKey, appointmentsInDay);
            console.log('Buscou do Banco!');
        }

        return appointmentsInDay;
    }
}

export default ListProviderAppointmentsService;
