
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth-options"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session || session.user?.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.method === 'PUT') {
        const { id, price, description, title } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        try {
            const product = await prisma.product.update({
                where: { id: parseInt(id) },
                data: {
                    price: price ? parseInt(price) : undefined,
                    title: title,
                    description: description
                }
            });

            return res.status(200).json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ message: 'Error updating product' });
        }
    }

    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
