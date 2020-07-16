import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentsService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated); // aplica em todas a rotas o middleware

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user);
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

// pode fazer assim por que lá no index tá apontando no comando use
appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentsService();

    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
