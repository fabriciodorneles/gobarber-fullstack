import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    next: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // validaçao do token

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    // bota esse try aqui aqui pq sobreescrever o erro do verify
    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as ITokenPayload; // força a interface no decoded

        // porque adicionou(overryde) user na express lá no types
        request.user = {
            id: sub,
        };

        next();
    } catch (err) {
        throw new AppError('Invalid JWT token', 401);
    }
}
