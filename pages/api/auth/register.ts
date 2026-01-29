import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { hashPassword, validateEmail } from '../../../lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, name } = req.body;

        // Validations
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                role: 'customer',
            },
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Registration error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return res.status(500).json({ error: 'Error al crear usuario: ' + (error instanceof Error ? error.message : 'Unknown') });
    }
}
