import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = await prisma.product.findUnique({
                where: { id: String(id) },
            });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching product' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { active, stock, price, title, description } = req.body;

            const updatedProduct = await prisma.product.update({
                where: { id: String(id) },
                data: {
                    ...(active !== undefined && { active }),
                    ...(stock !== undefined && { stock: Number(stock) }),
                    ...(price !== undefined && { price: Number(price) }),
                    ...(title && { title }),
                    ...(description && { description }),
                },
            });

            return res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: 'Error updating product' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.product.delete({
                where: { id: String(id) },
            });
            return res.status(204).end();
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Error deleting product' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
