import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
        try {
            const [
                totalOrders,
                totalSales,
                pendingOrders
            ] = await Promise.all([
                prisma.order.count(),
                prisma.order.aggregate({
                    _sum: {
                        total: true
                    }
                }),
                prisma.order.count({
                    where: {
                        status: {
                            in: ['pending', 'paid', 'fulfillment_pending']
                        }
                    }
                })
            ]);

            return res.status(200).json({
                totalOrders,
                totalSales: totalSales._sum.total || 0,
                pendingOrders,
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            return res.status(500).json({ error: 'Error fetching stats' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
