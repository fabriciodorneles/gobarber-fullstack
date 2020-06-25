import 'reflect-metadata';

import express from 'express';
import routes from './routes';

import './database'; // importa a conexão do BD

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
    // emoji WIN + .
    console.log('🏹 Server started on port 3333');
});
