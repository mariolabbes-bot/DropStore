import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
        try {
            const products = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching products' });
        }
    }

    if (req.method === 'POST') {
        // Create new product manually
        return res.status(501).json({ error: 'Not implemented yet' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
