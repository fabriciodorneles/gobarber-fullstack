import 'reflect-metadata';
import 'dotenv/config';
import { errors } from 'celebrate';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import cors from 'cors';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm'; // importa a conexão do BD
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder)); // vai mostrar nessa rota a pasta com estática, quer dizer, vai mostrar a imagem direto no browser
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.log(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});
const port = 3333;
app.listen(port, () => {
    // emoji WIN + .
    console.log(`🏹 Server started on port ${port}`);
});
