import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ message: 'No autorizado' });
    }

    if (req.method === 'GET') {
        try {
            const orders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { email: true, name: true }
                    },
                    items: true
                },
                take: 50 // Límite inicial
            });

            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error obteniendo pedidos' });
        }
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
