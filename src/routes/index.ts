import { Router } from 'express';

import appointmentsRouter from './appointments.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter); // por causa do use, qualquer pedido(get, post, etc.)
// rota que inicie com /appointments vai repasssar tudo que vier depois de /apointments para o appoiments.routes

export default routes;
