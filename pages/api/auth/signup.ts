import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../../lib/auth-utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, name } = req.body;

    if (!email || !email.includes('@') || !password || password.trim().length < 7) {
        return res.status(422).json({
            message: 'Input inválido - contraseña debe tener al menos 7 caracteres',
        });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(422).json({ message: 'Ese email ya está registrado' });
    }

    const hashedPassword = await hashPassword(password);

    const result = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    res.status(201).json({ message: 'Usuario creado!', userId: result.id });
}
