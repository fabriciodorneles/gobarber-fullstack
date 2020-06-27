import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database'; // importa a conexão do BD

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); // vai mostrar nessa rota a pasta com estática, quer dizer, vai mostrar a imagem direto no browser
app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
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

app.listen(3333, () => {
    // emoji WIN + .
    console.log('🏹 Server started on port 3333');
});
