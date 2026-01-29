
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user?.email !== 'admin@dropstore.com') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
        const { id, price, title, verified } = req.body;

        if (!id) return res.status(400).json({ message: 'Missing ID' });

        try {
            const updated = await prisma.product.update({
                where: { id: Number(id) },
                data: {
                    price: Number(price),
                    title: title,
                    verified: verified
                }
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating product' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
