import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    try {
      const { sessionId, orderId } = req.query;

      // Get order by Stripe session ID
      if (sessionId) {
        const order = await prisma.order.findFirst({
          where: { paymentId: sessionId as string },
          include: { items: true },
        });

        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(200).json(order);
      }

      // Get order by ID
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: parseInt(orderId as string) },
          include: { items: true },
        });

        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user owns this order (if logged in)
        if (session?.user?.id && order.userId !== session.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        return res.status(200).json(order);
      }

      // Get all orders for logged-in user
      if (session?.user?.id) {
        const orders = await prisma.order.findMany({
          where: { userId: session.user.id },
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json(orders);
      }

      return res.status(400).json({ error: 'Missing query parameters' });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Error fetching orders' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
